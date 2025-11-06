<script setup lang="ts">
import TestResultModal from "@/features/Result/TestResultModal.vue";
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
  <div class="complete-page-wrapper">
    <CompleteTest @show-result="showResult" />

    <v-dialog width="600" v-model:model-value="isResult">
      <TestResultModal
        :data="result"
        @lool-result="loolResult"
        @return-to-lessons="returnToLessons"
      />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.complete-page-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: #F8FAFB;
}
</style>
