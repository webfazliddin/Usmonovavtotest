<script setup lang="ts">
import CompleteTest from "@/features/Test/CompleteTest.vue";
import { ref } from "vue";
// import ResultTest from "@/features/Test/ResultTest.vue";
// import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);

// const isCompleteTestResult = ref<boolean>(false);
// const testResultAttempId = ref<number | null>(null);

const showResult = (val: number) => {
  // Yakuniy bossa 1minutlik loading bosa ham mayli (Fazliddin tgda)
  loading.value = true;
  setTimeout(() => {
    router.push({ name: "ResultPage", params: { attemptId: val } });
    loading.value = false;
  }, 700);
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
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
