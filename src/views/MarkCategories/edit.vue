<script setup lang="ts">
import FormTabRow from "@/components/form/FormTabRow.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { useThrottle } from "@/composables/useThrottle";
import { IFields, ISelectList } from "@/models/basic";
import { MarkCategoriesService } from "@/services/services/MarkCategories.service";
import { CategoriesService } from "@/services/services/Categories";
import { QuestionsService } from "@/services/services/Questions";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";
import { ArrowLeftIcon } from "vue-tabler-icons";

interface IMarkCategoryQuestions {
  id?: number;
  markCategoryId?: number;
  orderCode: number;
  questionId: number | null;
  question: string;
}

interface IMarkCategoriesDto {
  name: string;
  markCategoryQuestions: IMarkCategoryQuestions[];
  id: number;
  categoryId: number | null;
}

const route = useRoute();
const router = useRouter();
const { throttle } = useThrottle();

const { t } = useI18n();
const id = computed(() => route.params.id as string);
const markQuestionsList = ref<any[]>([]);
const categories = ref<ISelectList[]>([]);
const markQuestionLoading = ref(false);
const editIndex = ref(-1);

const fields: IFields[] = [
  { key: "orderCode", label: "orderCode" },
  { key: "question", label: "question" },
  { key: "action", label: "action" },
];

const tabRow = ref<IMarkCategoryQuestions>({
  orderCode: 1,
  questionId: null,
  question: "",
  id: 0,
});

const markQuestionsFilter = ref<{
  page: number;
  size: number;
  total: number;
}>({
  page: 1,
  size: 20,
  total: 0,
});

const data = ref<IMarkCategoriesDto>({
  markCategoryQuestions: [],
  name: "",
  id: 0,
  categoryId: null,
});

const searchValue = ref("");
const questions = computed(() => {
  if (searchValue.value.length) {
    return data.value.markCategoryQuestions.filter((v) =>
      v.question.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }
  return data.value.markCategoryQuestions;
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    const api = +String(id.value) ? "PutMarkCategories" : "PostMarkCategories";
    const textUpd = +String(id.value) ? "Edited" : "Created";
    MarkCategoriesService[api](data.value, id.value).then((res) => {
      notify({
        text: t(`successUser${textUpd}`),
        type: "success",
      });
      back();
    });
  }
};

const fetchData = (val: string | number) => {
  if (!val || +val == 0) return;

  MarkCategoriesService.GetById(val)
    .then((res: AxiosResponse<IMarkCategoriesDto>) => {
      data.value = res.data;

      // If categoryId exists and there are questions, fetch all questions to populate text
      if (res.data.categoryId && res.data.markCategoryQuestions.length > 0) {
        fetchAllQuestionsForCategory();
      }

      // Also fetch questions for the dropdown if category exists
      if (res.data.categoryId) {
        fetchQuestions();
      }
    })
    .catch((e) => {
      notify({
        text: e?.message,
        type: "error",
      });
    });
};

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid && data.value) {
    if (editIndex.value > -1) {
      Object.assign(
        data.value.markCategoryQuestions[editIndex.value],
        tabRow.value
      );
      editIndex.value = -1;
    } else {
      const d = data.value.markCategoryQuestions.map((el) => el.questionId);

      if (d.includes(tabRow.value.questionId)) {
        notify({
          text: t("includedQuestions"),
          type: "warn",
        });

        return;
      }
      data.value.markCategoryQuestions.push(
        JSON.parse(JSON.stringify(tabRow.value))
      );
    }

    tabRow.value = {
      orderCode: data.value.markCategoryQuestions.length + 1,
      questionId: null,
      question: "",
      id: 0,
    };
  }
};

const deleteRow = (index: number) => {
  data.value.markCategoryQuestions.splice(index, 1);
  // Tartib raqamlarni qayta hisoblash
  data.value.markCategoryQuestions.forEach((item, idx) => {
    item.orderCode = idx + 1;
  });
  // Keyingi qo'shish uchun orderCode'ni yangilash
  tabRow.value.orderCode = data.value.markCategoryQuestions.length + 1;
};

const editRow = (item: any) => {
  const index = data.value.markCategoryQuestions.findIndex(
    (q) => q.questionId === item.questionId
  );
  if (index > -1) {
    editIndex.value = index;
    tabRow.value = JSON.parse(JSON.stringify(item));
  }
};

const setField = (val: any) => {
  if (val && val.questionText) {
    tabRow.value.question = val.questionText;
    tabRow.value.questionId = val.id;
  } else if (val && typeof val === 'object' && val.id) {
    // Handle case where val might be the full object
    tabRow.value.question = val.questionText || '';
    tabRow.value.questionId = val.id;
  }
};

const back = () => {
  router.push({ name: "MarkCategories" });
};

const fetchQuestions = () => {
  if (!data.value.categoryId) return;

  markQuestionLoading.value = true;
  throttle(() => {
    QuestionsService.GetQuestions(
      `Page=${markQuestionsFilter.value.page}&Size=${markQuestionsFilter.value.size}&categoryId=${data.value.categoryId}`
    )
      .then((res) => {
        markQuestionsList.value = res.data.data;
        markQuestionsFilter.value.total = res.data.totalCount;
      })
      .finally(() => {
        markQuestionLoading.value = false;
      });
  }, 400);
};

const fetchAllQuestionsForCategory = () => {
  if (!data.value.categoryId) return;

  // Fetch all questions for this category to populate question text
  QuestionsService.GetQuestions(
    `Page=1&Size=1000&categoryId=${data.value.categoryId}`
  )
    .then((res) => {
      const allQuestions = res.data.data;

      // Create a new array with populated question text to trigger reactivity
      data.value.markCategoryQuestions = data.value.markCategoryQuestions.map((q) => {
        if (!q.question && q.questionId) {
          const foundQuestion = allQuestions.find(
            (item: any) => item.id === q.questionId
          );
          if (foundQuestion) {
            return { ...q, question: foundQuestion.questionText };
          }
        }
        return q;
      });
    })
    .catch((e) => {
      console.error('Error fetching questions for MarkCategories:', e);
    });
};

const fetchCategories = () => {
  CategoriesService.SelectList().then((res) => {
    categories.value = res.data;
  });
};

watch(
  () => route.params.id,
  (val) => {
    if (val) {
      fetchData(val as string);
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <v-btn
        icon
        variant="text"
        size="small"
        class="back-btn"
        @click="back"
      >
        <ArrowLeftIcon size="20" />
      </v-btn>
      <h1 class="page-title">
        {{ $t(`${route.params.id !== "0" ? "Edite" : "Create"}MarkCategories`) }}
      </h1>
    </div>

    <v-form @submit.prevent="saveData">
      <v-row>
        <v-col cols="12">
        <!-- Asosiy ma'lumot -->
        <div class="main-info-section">
          <v-row>
            <v-col cols="12">
              <form-input
                v-model="data.name"
                :label="$t('name')"
                :placeholder="$t('name')"
                required
              />
            </v-col>
          </v-row>
        </div>

        <!-- Savollar qo'shish qismi -->
        <FormTabRow
          :fields="fields"
          :items="questions"
          v-model:edit-index="editIndex"
          @delete-tab-row="deleteRow"
          @edit-tab-row="editRow"
          :actions="{
            isDelete: true,
            isEdit: true,
          }"
          table-height="400px"
        >
          <template #card-header>
            <div class="section-header">
              <h3 class="section-title">{{ $t("testPage") }}</h3>
              <v-chip color="primary" variant="tonal" class="count-chip">
                {{ data.markCategoryQuestions.length }} {{ $t("question") }}
              </v-chip>
            </div>
          </template>

          <v-form @submit.prevent="addRow">
            <v-row class="question-form">
              <!-- Search qismi -->
              <v-col cols="12">
                <form-input
                  v-model="searchValue"
                  :label="$t('searchQuestion')"
                  :placeholder="$t('searchQuestion')"
                  clearable
                >
                  <template #prepend-inner>
                    <v-icon size="20">mdi-magnify</v-icon>
                  </template>
                </form-input>
              </v-col>

              <!-- Bo'lim tanlash -->
              <v-col lg="12" cols="12">
                <form-select
                  :list="categories"
                  v-model="data.categoryId"
                  :label="$t('category')"
                  item-title="name"
                  item-value="id"
                  required
                  @update:model-value="fetchQuestions"
                />
              </v-col>

              <!-- Tartib raqam -->
              <v-col lg="3" md="4" cols="12">
                <form-input
                  v-model="tabRow.orderCode"
                  :label="$t('orderCode')"
                  type="number"
                  required
                />
              </v-col>

              <!-- Savol tanlash -->
              <v-col lg="6" md="5" cols="12">
                <form-select
                  :list="markQuestionsList"
                  v-model="tabRow.questionId"
                  :label="$t('question')"
                  item-title="questionText"
                  item-value="id"
                  :loading="markQuestionLoading"
                  required
                  @update:model-value="setField"
                  no-search
                  return-object
                >
                  <template #append-item>
                    <v-divider></v-divider>
                    <div class="pa-2">
                      <v-pagination
                        rounded="circle"
                        density="compact"
                        v-model="markQuestionsFilter.page"
                        :length="
                          Math.ceil(
                            markQuestionsFilter.total / markQuestionsFilter.size
                          )
                        "
                        :total-visible="4"
                        @update:model-value="fetchQuestions"
                      />
                    </div>
                  </template>
                </form-select>
              </v-col>

              <!-- Qo'shish tugmasi -->
              <v-col lg="3" md="3" cols="12" class="d-flex align-end">
                <v-btn
                  type="submit"
                  :color="editIndex > -1 ? 'success' : 'primary'"
                  size="large"
                  block
                  class="action-btn"
                >
                  <v-icon start>
                    {{ editIndex > -1 ? 'mdi-check' : 'mdi-plus' }}
                  </v-icon>
                  {{ editIndex > -1 ? $t('save') : $t('AddRow') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </FormTabRow>
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-row class="mt-4">
        <v-col cols="12">
          <div class="action-buttons">
            <v-btn color="error" variant="outlined" size="large" @click="back">
              <v-icon start>mdi-close</v-icon>
              {{ $t("cancel") }}
            </v-btn>

            <v-btn color="success" type="submit" size="large" variant="flat">
              <v-icon start>mdi-content-save</v-icon>
              {{ $t("save") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;

  .back-btn {
    color: #667eea;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(-2px);
    }
  }

  .page-title {
    font-family: 'Poppins', sans-serif;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
}

.main-info-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;

  .section-title {
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .count-chip {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
  }
}

.question-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
}

.action-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  border-radius: 8px !important;
  height: 48px !important;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);

  :deep(.v-btn) {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    border-radius: 8px !important;
    padding: 0 32px !important;
    min-width: 140px;
  }
}

// Responsive
@media (max-width: 960px) {
  .page-container {
    padding: 16px;
  }

  .page-header {
    .page-title {
      font-size: 24px;
    }
  }

  .main-info-section {
    padding: 20px;
  }

  .question-form {
    padding: 16px;
  }

  .action-buttons {
    padding: 16px;

    :deep(.v-btn) {
      min-width: 120px;
      padding: 0 24px !important;
    }
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 12px;
  }

  .page-header {
    .page-title {
      font-size: 20px;
    }
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    flex-direction: column;

    :deep(.v-btn) {
      min-width: 100%;
      padding: 0 16px !important;
    }
  }
}
</style>
