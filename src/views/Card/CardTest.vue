<script setup lang="ts">
import CompleteTest from "@/features/Test/CompleteTest.vue";
import { ICategoryAttempData } from "@/features/Test/types";
import { ExamService } from "@/services/services/Exams.service";
import { setError } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const isResult = ref(false);
const result = ref<ICategoryAttempData[]>([]);

const showResult = (val: number) => {
  loading.value = true;
  ExamService.GetExmasResultByAttemp(val)
    .then((res) => {
      isResult.value = true;
      result.value = res.data;
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const loolResult = (val: number | null) => {
  router.push({ name: "ResultPage", params: { attemptId: val } });
};
const returnToLessons = (val: number | null) => {
  isResult.value = false;
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>{{ $t("completeTest") }}</h1>
      </v-card-title>
      <v-card-text>
        <CompleteTest @show-result="showResult" />

        <v-dialog width="600" v-model:model-value="isResult">
          <TestResultModal
            :data="result"
            @lool-result="loolResult"
            @return-to-lessons="returnToLessons"
          />
        </v-dialog>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
