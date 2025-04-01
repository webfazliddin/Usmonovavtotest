<script setup lang="ts">
import { useThrottle } from "@/composables/useThrottle";
import { CardTestsService } from "@/services/services/CardTests.service";
import { QuestionsService } from "@/services/services/Questions";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

interface ICardTestQuestions {
  id: number;
  cardTestId?: number;
  questionId: number;
}

interface ICardTestsDto {
  orderCode: string;
  shortName: string;
  fullName: string;
  cardTestQuestions: ICardTestQuestions[];
}

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();
const { throttle } = useThrottle();

const { t } = useI18n();
const id = computed(() => route.params.id);
const cardQuestions = ref<number[]>([]);
const cardQuestionsList = ref<number[]>([]);
const cardQuestionLoading = ref(false);

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
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    const textUpd = +String(id) ? "Edited" : "Created";
    CardTestsService.PostCardTests(data.value).then((res) => {
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

      cardQuestions.value = res.data.cardTestQuestions.map(
        (el) => el.questionId
      );
    })
    .catch((e) => {
      notify({
        text: e?.message,
        type: "error",
      });
    });
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
        let list = [...cardQuestionsList.value, ...res.data.data];
        cardQuestionsList.value = [
          ...new Map(list.map((item) => [item["id"], item])).values(),
        ];

        cardQuestionsFilter.value.total = res.data.totalCount;
      })
      .finally(() => {
        cardQuestionLoading.value = false;
      });
  }, 400);
};

const updateCardQuestions = () => {
  data.value.cardTestQuestions = cardQuestions.value.map((el) => {
    return {
      questionId: el,
      id: 0,
    };
  });

  console.log(data.value);
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
          <v-col lg="4" cols="12">
            <v-label class="mb-2 font-weight-medium">
              {{ $t("cardQuestions") }}
            </v-label>
            <v-select
              class="custom-select"
              multiple
              :items="cardQuestionsList"
              v-model:model-value="cardQuestions"
              :item-title="'questionText'"
              item-value="id"
              :loading="cardQuestionLoading"
              @update:model-value="updateCardQuestions"
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
        </v-row>
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

<style lang="scss">
.custom-select {
  .v-field__loader {
    top: 0 !important;
  }
}
</style>
