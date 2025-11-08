<script setup lang="ts">
import CardTestResult from "@/features/Test/CardTestResult.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const attempId = +(route.params.attemptId as string);

const goTestsButton = () => {
  router.push({ name: "Card" });
};
</script>

<template>
  <div class="modern-result-page">
    <CardTestResult :attemp-id="attempId" @goTests="goTestsButton" />
  </div>
</template>

<style scoped lang="scss">
.modern-result-page {
  max-width: 1920px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Mobile styles
@media (max-width: 768px) {
  .modern-result-page {
    padding: 0;
  }
}
</style>
