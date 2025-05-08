<script setup lang="ts">
import FormTabRow from "@/components/form/FormTabRow.vue";
import { useThrottle } from "@/composables/useThrottle";
import { IFields } from "@/models/basic";
import { CardTestsService } from "@/services/services/CardTests.service";
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
  orderCode: number;
  questionId: number | null;
  question: string;
}

interface ICardTestsDto {
  orderCode: string;
  shortName: string;
  fullName: string;
  cardTestQuestions: ICardTestQuestions[];
  id: number;
}

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();
const { throttle } = useThrottle();

const { t } = useI18n();
const id = computed(() => route.params.id as string);
const cardQuestionsList = ref<number[]>([]);
const cardQuestionLoading = ref(false);
const editIndex = ref(-1);

const fields: IFields[] = [
  { key: "orderCode", label: "orderCode" },
  { key: "question", label: "question" },
  { key: "action", label: "action" },
];

const tabRow = ref<ICardTestQuestions>({
  orderCode: 1,
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
  orderCode: "",
  shortName: "",
  id: 0,
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    const api = +String(id.value) ? "PutCardTests" : "PostCardTests";
    const textUpd = +String(id.value) ? "Edited" : "Created";
    CardTestsService[api](data.value, id.value).then((res) => {
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

  CardTestsService.GetById(val)
    .then((res: AxiosResponse<ICardTestsDto>) => {
      data.value = res.data;
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
      orderCode: data.value.cardTestQuestions.length + 1,
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
  router.push({ name: "CardTests" });
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
  fetchQuestions();
});
</script>

<template>
  <v-card>
    <v-form @submit.prevent="saveData">
      <v-card-title>
        <h2>
          {{
            $t(`${route.params.id !== "0" ? "Edite" : "Create"}MarkCategories`)
          }}
        </h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col lg="4" cols="12">
            <form-input v-model="data.orderCode" :label="$t('orderCode')" />
          </v-col>
          <v-col lg="4" cols="12">
            <form-input v-model="data.shortName" :label="$t('shortName')" />
          </v-col>
          <v-col lg="4" cols="12">
            <form-input v-model="data.fullName" :label="$t('fullName')" />
          </v-col>
        </v-row>

        <FormTabRow
          :fields="fields"
          :items="data.cardTestQuestions"
          v-model:edit-index="editIndex"
          @delete-tab-row="deleteRow"
          :actions="{
            isDelete: true,
          }"
        >
          <v-form @submit.prevent="addRow">
            <v-row>
              <v-col cols="12">
                <h2>{{ $t("testPage") }}</h2>
              </v-col>
              <v-col lg="4" cols="12">
                <form-input
                  v-model="tabRow.orderCode"
                  :label="$t('orderCode')"
                />
              </v-col>
              <v-col lg="4" cols="12">
                <v-label class="mb-2 font-weight-medium">
                  {{ $t("testPage") }}
                </v-label>
                <v-select
                  class="custom-select"
                  :items="cardQuestionsList"
                  v-model:model-value="tabRow.questionId"
                  :item-title="'questionText'"
                  item-value="id"
                  :loading="cardQuestionLoading"
                  @update:model-value="setField"
                  return-object
                >
                  <template #loader>
                    <v-list-item v-if="cardQuestionLoading">
                      <v-progress-circular indeterminate></v-progress-circular>
                    </v-list-item>
                  </template>

                  <template #append-item>
                    <v-pagination
                      rounded="circle"
                      class="my-custom-pagination"
                      v-model="cardQuestionsFilter.page"
                      :length="
                        Math.ceil(
                          cardQuestionsFilter.total / cardQuestionsFilter.size
                        )
                      "
                      :total-visible="4"
                      @click="fetchQuestions"
                    />
                  </template>
                </v-select>
              </v-col>

              <v-col lg="4" cols="12" class="mt-7">
                <v-btn
                  type="submit"
                  :color="editIndex > -1 ? 'success' : 'info'"
                  :text="editIndex > -1 ? $t('Save') : $t('AddRow')"
                />
              </v-col>
            </v-row>
          </v-form>
        </FormTabRow>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="back">
          {{ $t("cancel") }}
        </v-btn>
        <v-spacer />

        <v-btn color="success" type="submit"> {{ $t("save") }} </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<style lang="scss" scoped>
.custom-select {
  .v-field__loader {
    top: 0 !important;
  }
}
</style>
