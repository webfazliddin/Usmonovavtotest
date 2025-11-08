<script setup lang="ts">
import CardResultModal from "@/features/Result/CardResultModal.vue";
import CardTest from "@/features/Test/CardTest.vue";
import { CardTestResult } from "@/features/Test/types";
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const isResult = ref(false);
const result = ref<CardTestResult | null>(null);
const attemptId = ref<number | null>(null);

const showResult = (val: number) => {
  loading.value = true;
  attemptId.value = val;
  CardService.DefaultResult(val)
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

const loolResult = () => {
  router.push({
    name: "CardResultPage",
    params: { attemptId: attemptId.value },
  });
};
const returnToLessons = () => {
  isResult.value = false;
  router.push({
    name: "Card",
  });
};
</script>

<template>
  <div class="modern-test-page">
    <!-- Header -->
    <div class="test-header">
      <button class="back-btn" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t("back") }}</span>
      </button>
    </div>

    <!-- Test Content -->
    <div class="test-content">
      <CardTest @show-result="showResult" />
    </div>

    <!-- Result Modal -->
    <v-dialog width="600" v-model:model-value="isResult">
      <CardResultModal :data="result" @lool-result="loolResult" @return-to-lessons="returnToLessons" />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.modern-test-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.4s ease;
}

.test-header {
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

.test-content {
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
  .modern-test-page {
    padding: 16px;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
