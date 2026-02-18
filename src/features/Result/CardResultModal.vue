<script setup lang="ts">
import { computed, toRefs } from "vue";
import { CardTestResult } from "../Test/types";

interface IProps {
  data: CardTestResult | null;
}

const props = defineProps<IProps>();
const { data } = toRefs(props);

const percentage = computed(() => {
  if (!data.value || !data.value.questionsCount) return 0;
  return Math.round((data.value.correctAnswerCount / data.value.questionsCount) * 100);
});

const incorrectCount = computed(() => {
  if (!data.value) return 0;
  return (data.value.answeredCount || data.value.questionsCount) - data.value.correctAnswerCount;
});

const isPassed = computed(() => percentage.value >= 80);

const emits = defineEmits(["returnToLessons", "loolResult"]);
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <!-- Result circle -->
      <div class="result-circle" :class="{ 'result-circle--passed': isPassed }">
        <span class="result-num">{{ percentage }}</span>
        <span class="result-pct">%</span>
      </div>

      <h2 class="modal-title">
        {{ isPassed ? 'Ajoyib natija!' : 'Test yakunlandi' }}
      </h2>
      <p class="modal-sub">
        {{ data?.questionsCount }} ta savoldan {{ data?.correctAnswerCount }} tasiga to'g'ri javob berdingiz
      </p>

      <!-- Stats -->
      <div class="modal-stats">
        <div class="m-stat">
          <span class="m-stat-num">{{ data?.questionsCount || 0 }}</span>
          <span class="m-stat-lbl">Jami</span>
        </div>
        <div class="m-stat m-stat--correct">
          <span class="m-stat-num">{{ data?.correctAnswerCount || 0 }}</span>
          <span class="m-stat-lbl">To'g'ri</span>
        </div>
        <div class="m-stat m-stat--wrong">
          <span class="m-stat-num">{{ incorrectCount }}</span>
          <span class="m-stat-lbl">Xato</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="modal-actions">
        <button class="m-btn m-btn--secondary" @click="emits('returnToLessons')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Mavzularga qaytish
        </button>
        <button class="m-btn m-btn--primary" @click="emits('loolResult', data?.attemptId)">
          Natijani ko'rish
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.35s ease;
}

.result-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 20px;

  &--passed {
    background: #ecfdf5;

    .result-num {
      color: #10B981;
    }

    .result-pct {
      color: #10B981;
    }
  }
}

.result-num {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #EF4444;
  line-height: 1;
  padding-top: 30px;
}

.result-pct {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #EF4444;
}

.modal-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 6px 0;
}

.modal-sub {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.modal-stats {
  display: flex;
  gap: 12px;
  width: 100%;
  margin-bottom: 28px;
}

.m-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  background: #f4f5f7;
  border-radius: 12px;

  &--correct {
    background: #ecfdf5;

    .m-stat-num {
      color: #10B981;
    }
  }

  &--wrong {
    background: #fef2f2;

    .m-stat-num {
      color: #EF4444;
    }
  }
}

.m-stat-num {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #1F2937;
}

.m-stat-lbl {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.m-btn {
  flex: 1;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    transform: scale(0.98);
  }

  &--secondary {
    background: #f4f5f7;
    color: #4b5563;
  }

  &--primary {
    background: #5D87FF;
    color: white;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .modal-card {
    padding: 28px 20px;
    border-radius: 16px;
  }

  .result-circle {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
  }

  .result-num {
    font-size: 18px;
    padding-top: 24px;
  }

  .result-pct {
    font-size: 14px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-sub {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .m-stat {
    padding: 10px 6px;
  }

  .m-stat-num {
    font-size: 20px;
  }

  .m-stat-lbl {
    font-size: 11px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 8px;
  }

  .m-btn {
    padding: 12px;
    font-size: 13px;
  }
}
</style>
