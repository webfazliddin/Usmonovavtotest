<script setup lang="ts">
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LockIcon, LockOpenIcon } from "vue-tabler-icons";

const router = useRouter();

const cards = ref<any[]>([]);
const loading = ref(false);

const fetchCards = async () => {
  loading.value = true;
  CardService.GetCards()
    .then((res) => {
      cards.value = res.data;
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

fetchCards();

const fetchCard = (item: any) => {
  // isLocked: true = ochiq, false = yopiq
  if (item?.isLocked === false) return;

  if (item.successAttemptId && getProgress(item) === 100) {
    router.push({ name: "CardResultPage", params: { attemptId: item.successAttemptId } });
  } else {
    router.push({ name: "CardTest", params: { cardId: item.id } });
  }
};

const getProgress = (card: any) => {
  if (!card.questionsCount || card.questionsCount === 0) return 0;
  const answeredQuestions = (card.successCorrectAnswersCount || 0) + (card.successIncorrectAnswersCount || 0);
  return Math.round((answeredQuestions / card.questionsCount) * 100);
};

const getAnsweredCount = (card: any) => {
  return (card.successCorrectAnswersCount || 0) + (card.successIncorrectAnswersCount || 0);
};
</script>

<template>
  <div class="page">
    <!-- Loading -->
    <div v-if="loading" class="loading-wrap">
      <v-progress-circular
        indeterminate
        color="#6B7280"
        :size="48"
        :width="3"
      ></v-progress-circular>
    </div>

    <!-- Cards -->
    <div v-if="!loading && cards.length" class="grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="card"
        :class="{ 'card--locked': card.isLocked === false }"
        @click="fetchCard(card)"
      >
        <!-- Top row: mavzu + badge -->
        <div class="card-top">
          <span class="card-topic">{{ index + 1 }}-Mavzu</span>
          <span
            class="badge"
            :class="card.isLocked === true ? 'badge--open' : 'badge--closed'"
          >
            {{ card.isLocked === true ? 'Ochiq' : 'Yopiq' }}
          </span>
        </div>

        <!-- Name -->
        <p class="card-name">{{ card.name }}</p>

        <!-- Stats row -->
        <div class="stats">
          <div class="stat">
            <span class="stat-num">{{ card.questionsCount || 0 }}</span>
            <span class="stat-lbl">Savollar</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ getAnsweredCount(card) }}</span>
            <span class="stat-lbl">Yechilgan</span>
          </div>
          <div class="stat">
            <span class="stat-num stat-num--correct">{{ card.successCorrectAnswersCount || 0 }}</span>
            <span class="stat-lbl">To'g'ri</span>
          </div>
          <div class="stat">
            <span class="stat-num stat-num--wrong">{{ card.successIncorrectAnswersCount || 0 }}</span>
            <span class="stat-lbl">Xato</span>
          </div>
        </div>

        <!-- Progress -->
        <div class="progress">
          <div class="progress-top">
            <span class="progress-lbl">Natija</span>
            <span class="progress-val">{{ getProgress(card) }}%</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${getProgress(card)}%` }"
            ></div>
          </div>
        </div>

        <!-- Action -->
        <button
          class="btn"
          :class="{
            'btn--locked': card.isLocked === false,
            'btn--result': card.isLocked !== false && getProgress(card) === 100 && card.successAttemptId,
            'btn--continue': card.isLocked !== false && getAnsweredCount(card) > 0 && !(getProgress(card) === 100 && card.successAttemptId),
            'btn--start': card.isLocked !== false && getAnsweredCount(card) === 0,
          }"
          @click.stop="fetchCard(card)"
        >
          {{
            card.isLocked === false ? 'Qulflangan' :
            getProgress(card) === 100 && card.successAttemptId ? 'Natijani ko\'rish' :
            getAnsweredCount(card) > 0 ? 'Davom ettirish' :
            'Boshlash'
          }}
          <svg v-if="card.isLocked !== false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!loading && !cards.length" class="empty">
      <p>Mavzular topilmadi</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &:hover {
    background: #fafafa;
  }

  &--locked {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background: #ffffff;
    }
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-topic {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;

  &--open {
    background: #ecfdf5;
    color: #10B981;
  }

  &--closed {
    background: #fef2f2;
    color: #EF4444;
  }
}

.card-name {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}

.stat-num {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;

  &--correct {
    color: #10B981;
  }

  &--wrong {
    color: #EF4444;
  }
}

.stat-lbl {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-lbl {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.progress-val {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.progress-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #5D87FF;
  border-radius: 100px;
  transition: width 0.4s ease;
}

.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin-top: auto;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    transform: scale(0.98);
  }

  &--start {
    background: #5D87FF;
    color: white;
  }

  &--continue {
    background: #10B981;
    color: white;
  }

  &--result {
    background: #1f2937;
    color: white;
  }

  &--locked {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;

    &:hover {
      opacity: 1;
    }
  }
}

.empty {
  text-align: center;
  padding: 80px 20px;

  p {
    font-size: 14px;
    color: #9ca3af;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Tablet
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Mobile
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .card {
    padding: 14px;
    gap: 10px;
    border-radius: 12px;
  }

  .card-topic {
    font-size: 13px;
  }

  .badge {
    font-size: 10px;
    padding: 2px 8px;
  }

  .card-name {
    font-size: 12px;
    min-height: 36px;
  }

  .stats {
    gap: 4px;
  }

  .stat {
    padding: 6px 2px;
    border-radius: 8px;
  }

  .stat-num {
    font-size: 15px;
  }

  .stat-lbl {
    font-size: 8px;
  }

  .progress-lbl {
    font-size: 11px;
  }

  .progress-val {
    font-size: 12px;
  }

  .progress-track {
    height: 5px;
  }

  .btn {
    padding: 9px 12px;
    font-size: 11px;
    border-radius: 8px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
}

// Small mobile
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .card {
    padding: 16px;
    gap: 12px;
  }

  .card-topic {
    font-size: 15px;
  }

  .card-name {
    font-size: 14px;
  }

  .stat-num {
    font-size: 18px;
  }

  .stat-lbl {
    font-size: 9px;
  }

  .btn {
    padding: 11px 16px;
    font-size: 13px;
  }
}

// Landscape
@media (max-width: 768px) and (orientation: landscape) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .card {
    padding: 10px;
    gap: 8px;
  }

  .card-topic {
    font-size: 12px;
  }

  .stat-num {
    font-size: 14px;
  }

  .btn {
    padding: 7px 10px;
    font-size: 10px;
  }
}
</style>
