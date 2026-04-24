<script setup lang="ts">
import FormTabRow from "@/components/form/FormTabRow.vue";
import { useThrottle } from "@/composables/useThrottle";
import { IFields, ISelectList } from "@/models/basic";
import { CardTestsService } from "@/services/services/CardTests.service";
import { CoursesService } from "@/services/services/Courses.service";
import { QuestionsService } from "@/services/services/Questions";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

interface ICardTestQuestions {
  id?: number;
  cardTestId?: number;
  orderCode?: number;
  questionId: number | null;
  question?: string;
}

interface ICardTestsDto {
  shortName: string;
  fullName: string;
  cardTestQuestions: ICardTestQuestions[];
  id: number;
  courseId: number | null;
}

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();
const { throttle } = useThrottle();

const { t } = useI18n();
const id = computed(() => (route.params.testId || route.params.id || "0") as string);
const cardQuestionsList = ref<number[]>([]);
const categories = ref<ISelectList[]>([]);
const cardQuestionLoading = ref(false);
const editIndex = ref(-1);

const fields: IFields[] = [
  { key: "question", label: "question" },
  { key: "action", label: "action" },
];

const tabRow = ref<ICardTestQuestions>({
  questionId: null,
  question: "",
  id: 0,
});

const cardQuestionsFilter = ref<{
  page: number;
  size: number;
  total: number;
}>({
  page: 1,
  size: 20,
  total: 0,
});

const data = ref<ICardTestsDto>({
  cardTestQuestions: [],
  fullName: "",
  shortName: "",
  id: 0,
  courseId: null,
});

const searchValue = ref("");

const questions = computed(() => {
  return data.value.cardTestQuestions;
});

const filteredCardQuestionsList = computed(() => {
  if (searchValue.value && searchValue.value.length > 0) {
    return cardQuestionsList.value.filter((q: any) =>
      q.questionText?.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }
  return cardQuestionsList.value;
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (!valid) return;

  const api = +String(id.value) ? "PutCardTests" : "PostCardTests";
  const textUpd = +String(id.value) ? "Edited" : "Created";

  const payload = {
    id: data.value.id,
    shortName: data.value.shortName,
    fullName: data.value.fullName,
    courseId: data.value.courseId,
    cardTestQuestions: data.value.cardTestQuestions.map((q) => {
      const item: { id?: number; questionId: number | null } = { questionId: q.questionId };
      if (q.id && q.id > 0) item.id = q.id;
      return item;
    }),
  };

  CardTestsService[api](payload, id.value).then(() => {
    notify({ text: t(textUpd === "Created" ? "testCreated" : "testUpdated"), type: "success" });
    back();
  });
};

const fetchData = (val: string | number) => {
  if (!val || +val == 0) return;

  CardTestsService.GetById(val)
    .then((res: AxiosResponse<any>) => {
      const mappedQuestions = res.data.cardTestQuestions.map((q: any) => ({
        ...q,
        question: q.questionText || q.question || '',
      }));

      data.value = {
        ...res.data,
        cardTestQuestions: mappedQuestions,
      };

      fetchQuestions();
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
        data.value.cardTestQuestions[editIndex.value],
        tabRow.value
      );
    } else {
      const d = data.value.cardTestQuestions.map((el) => el.questionId);

      if (d.includes(tabRow.value.questionId)) {
        notify({
          text: t("includedQuestions"),
          type: "warn",
        });

        return;
      }
      data.value.cardTestQuestions.push(
        JSON.parse(JSON.stringify(tabRow.value))
      );
    }

    tabRow.value = {
      questionId: null,
      question: "",
      id: 0,
    };
  }
};

const deleteRow = (index: number) => {
  data.value.cardTestQuestions.splice(index, 1);
};

const setField = (val: any) => {
  tabRow.value.question = val.questionText;
  tabRow.value.questionId = val.id;
};

const back = () => {
  emits("update:modelValue", false);
  const parentId = route.params.courseId || route.query.courseId;
  if (parentId) {
    router.push({ name: "EditCardTests", params: { id: String(parentId) } });
  } else {
    router.push({ name: "CardTests" });
  }
};

const fetchQuestions = () => {
  cardQuestionLoading.value = true;
  throttle(() => {
    QuestionsService.GetQuestions(
      `Page=${cardQuestionsFilter.value.page}&Size=${cardQuestionsFilter.value.size}`
    )
      .then((res) => {
        cardQuestionsList.value = res.data.data;
        cardQuestionsFilter.value.total = res.data.totalCount;
      })
      .finally(() => {
        cardQuestionLoading.value = false;
      });
  }, 400);
};

const fetchCategories = () => {
  CoursesService.SelectList().then((res) => {
    categories.value = res.data;
  });
};

watch(
  () => id.value,
  (val) => {
    if (val) {
      fetchData(val as string);
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchCategories();
  if (!+String(id.value)) {
    const qCategoryId = route.query.courseId;
    if (qCategoryId) {
      const cid = Number(qCategoryId);
      if (!Number.isNaN(cid)) data.value.courseId = cid;
    }
    fetchQuestions();
  }
});
</script>

<template>
  <v-card class="modal-card" rounded="lg">
    <v-form @submit.prevent="saveData">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h2 class="modal-title">
              {{ $t(`${route.params.id !== "0" ? "Edite" : "Create"}MarkCategories`) }}
            </h2>
            <p class="modal-subtitle">{{ $t("cardTests") }}</p>
          </div>
        </div>
        <button type="button" class="close-btn" @click="back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <v-divider />

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Basic Info Section -->
        <div class="form-section">
          <v-row>
            <v-col lg="6" md="6" cols="12">
              <form-input
                v-model="data.shortName"
                :label="$t('shortName')"
                required
              />
            </v-col>
            <v-col lg="6" md="6" cols="12">
              <form-input
                v-model="data.fullName"
                :label="$t('fullName')"
                required
              />
            </v-col>
          </v-row>
        </div>

        <!-- Questions Section -->
        <FormTabRow
          :fields="fields"
          :items="questions"
          v-model:edit-index="editIndex"
          @delete-tab-row="deleteRow"
          :actions="{
            isDelete: true,
          }"
          table-height="300px"
        >
          <template #card-header>
            <div class="section-header">
              <h3 class="section-title">{{ $t("testPage") }}</h3>
              <v-chip color="primary" variant="tonal" class="count-chip">
                {{ data.cardTestQuestions.length }} {{ $t("question") || "ta" }}
              </v-chip>
            </div>
          </template>

          <v-form @submit.prevent="addRow">
            <v-row class="question-form">
              <!-- Category Select -->
              <v-col lg="12" cols="12">
                <form-select
                  :list="categories"
                  v-model="data.courseId"
                  :label="$t('category')"
                  item-title="name"
                  item-value="id"
                  @update:model-value="fetchQuestions"
                />
              </v-col>

              <!-- Question Select -->
              <v-col lg="9" md="8" cols="12">
                <v-label class="modern-label">
                  {{ $t("testPage") }}
                  <span class="required-star">*</span>
                </v-label>
                <v-select
                  class="modern-question-select"
                  :items="filteredCardQuestionsList"
                  v-model:model-value="tabRow.questionId"
                  :item-title="'questionText'"
                  item-value="id"
                  :loading="cardQuestionLoading"
                  @update:model-value="setField"
                  return-object
                  variant="outlined"
                >
                  <template #prepend-item>
                    <v-list-item>
                      <v-text-field
                        v-model="searchValue"
                        :placeholder="$t('searchQuestion')"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                      />
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>

                  <template #loader>
                    <v-list-item v-if="cardQuestionLoading">
                      <v-progress-circular indeterminate size="24"></v-progress-circular>
                    </v-list-item>
                  </template>

                  <template #append-item>
                    <v-divider></v-divider>
                    <div class="pa-2">
                      <v-pagination
                        rounded="circle"
                        density="compact"
                        v-model="cardQuestionsFilter.page"
                        :length="
                          Math.ceil(
                            cardQuestionsFilter.total / cardQuestionsFilter.size
                          )
                        "
                        :total-visible="4"
                        @update:model-value="fetchQuestions"
                      />
                    </div>
                  </template>
                </v-select>
              </v-col>

              <!-- Add Button -->
              <v-col lg="3" md="3" cols="12" class="d-flex align-end">
                <v-btn
                  type="submit"
                  :color="editIndex > -1 ? 'success' : 'primary'"
                  size="large"
                  block
                  class="add-btn"
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
      </div>

      <!-- Modal Footer -->
      <v-divider />
      <div class="modal-footer">
        <button type="button" class="footer-btn footer-btn--cancel" @click="back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          {{ $t("cancel") }}
        </button>
        <button type="submit" class="footer-btn footer-btn--save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          {{ $t("save") }}
        </button>
      </div>
    </v-form>
  </v-card>
</template>

<style lang="scss" scoped>
.modal-card {
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #FAFBFC;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #EFF4FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5D87FF;
  flex-shrink: 0;
}

.modal-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  line-height: 1.3;
}

.modal-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #6B7280;
  margin: 2px 0 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.2s ease;

  &:hover {
    background: #FEE2E2;
    border-color: #FCA5A5;
    color: #EF4444;
  }
}

.modal-body {
  padding: 24px;
  max-height: 65vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;

    &:hover {
      background: #9CA3AF;
    }
  }
}

.form-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;

  .section-title {
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }

  .count-chip {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
  }
}

.question-form {
  background: #FAFBFC;
  border-radius: 12px;
  padding: 20px;
  margin-top: 12px;
}

.modern-label {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
  display: block;

  .required-star {
    color: #EF4444;
    margin-left: 2px;
  }
}

.modern-question-select {
  :deep(.v-field) {
    background: #FFFFFF !important;
    border-radius: 8px !important;
    border: 1px solid #E8ECF4 !important;
    transition: all 0.2s ease;
    font-family: 'Poppins', sans-serif;

    &:hover {
      border-color: #5D87FF !important;
    }
  }

  :deep(.v-field--focused) {
    border-color: #5D87FF !important;
  }

  :deep(.v-field__input) {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #1F2937;
    padding: 12px 16px;
    min-height: 48px;
  }

  :deep(.v-field__outline) {
    display: none !important;
  }
}

.add-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  border-radius: 8px !important;
  height: 48px !important;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #FAFBFC;
}

.footer-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &--cancel {
    background: white;
    color: #6B7280;
    border: 1px solid #E5E7EB;

    &:hover {
      background: #FEE2E2;
      color: #EF4444;
      border-color: #FCA5A5;
    }
  }

  &--save {
    background: #10B981;
    color: white;

    &:hover {
      background: #047857;
    }
  }
}

// Responsive
@media (max-width: 960px) {
  .modal-header {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .question-form {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .modal-header {
    padding: 14px 16px;
  }

  .modal-header-content {
    gap: 12px;
  }

  .modal-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-subtitle {
    font-size: 12px;
  }

  .modal-body {
    padding: 16px;
    max-height: 55vh;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .question-form {
    padding: 12px;
  }

  .modal-footer {
    padding: 12px 16px;
    flex-direction: column-reverse;

    .footer-btn {
      width: 100%;
    }
  }
}
</style>
