<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ExamTest from "@/features/Exam/ExamTest.vue";
import ExamResult from "@/features/Exam/ExamResult.vue";

const router = useRouter();
const currentView = ref<"exam" | "result">("exam");
const attemptId = ref<number | null>(null);

const showResult = (id: number) => {
  attemptId.value = id;
  currentView.value = "result";
};

const goBack = () => {
  router.push("/exam");
};
</script>

<template>
  <ExamTest v-if="currentView === 'exam'" @show-result="showResult" />
  <ExamResult v-if="currentView === 'result' && attemptId" :attempt-id="attemptId" @go-back="goBack" />
</template>
