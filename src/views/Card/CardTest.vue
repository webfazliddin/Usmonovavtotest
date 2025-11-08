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
    <CardTest @show-result="showResult" />

    <v-dialog
      v-if="isResult"
      v-model:model-value="isResult"
      fullscreen
      :transition="false"
      :scrim="false"
    >
      <CardResultModal
        :data="result"
        @lool-result="loolResult"
        @return-to-lessons="returnToLessons"
      />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.modern-test-page {
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
  .modern-test-page {
    padding: 0;
  }
}

// Fullscreen dialog styles
:deep(.v-dialog--fullscreen) {
  .v-overlay__content {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
</style>

<style>
/* Global fullscreen dialog fix */
.v-dialog.v-dialog--fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
}

.v-dialog.v-dialog--fullscreen .v-overlay__content {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
