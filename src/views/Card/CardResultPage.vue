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
    <!-- Header -->
    <div class="result-header">
      <button class="back-btn" @click="goTestsButton">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t("back") }}</span>
      </button>
      <h1 class="result-title">{{ $t("testResult") }}</h1>
    </div>

    <!-- Result Content -->
    <div class="result-content">
      <CardTestResult :attemp-id="attempId" @goTests="goTestsButton" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-result-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.4s ease;
}

.result-header {
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  background: #F8F9FC;
  color: #4A90E2;
  border: 1px solid #E8ECF4;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    background: #4A90E2;
    color: white;
    border-color: #4A90E2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.result-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.result-content {
  background: white;
  border-radius: 16px;
  border: 1px solid #E8ECF4;
  overflow: hidden;
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

@media (max-width: 768px) {
  .modern-result-page {
    padding: 16px;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .result-title {
    font-size: 24px;
  }
}
</style>
