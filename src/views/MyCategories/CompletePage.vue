<script setup lang="ts">
import CompleteTest from "@/features/Test/CompleteTest.vue";
// import ResultTest from "@/features/Test/ResultTest.vue";
// import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// const isCompleteTestResult = ref<boolean>(false);
// const testResultAttempId = ref<number | null>(null);

const showResult = (val: number) => {
  router.push({ name: "ResultPage", params: { attemptId: val } });
  //   testResultAttempId.value = val;
  //   isCompleteTestResult.value = true;
};
</script>

<template>
  <div>
    <CompleteTest @show-result="showResult" />

    <!-- <v-dialog
      v-if="isCompleteTestResult && testResultAttempId"
      v-model:model-value="isCompleteTestResult"
      fullscreen
    >
      <ResultTest
        v-if="testResultAttempId"
        v-model:model-value="isCompleteTestResult"
        :attempId="testResultAttempId"
      />
    </v-dialog> -->
  </div>
</template>

<style lang="scss" scoped></style>
