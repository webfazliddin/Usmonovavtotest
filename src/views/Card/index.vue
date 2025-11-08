<script setup lang="ts">
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { LockIcon, LockOpenIcon } from "vue-tabler-icons";

const router = useRouter();

const cards = ref<any[]>([]);

const fetchCards = async () => {
  CardService.GetCards()
    .then((res) => {
      cards.value = res.data;
    })
    .catch((e) => {
      setError(e);
    });
};

fetchCards();

const fetchCard = (item: any) => {
  // isLocked: true = ochiq, false = yopiq
  if (item?.isLocked === false) return;

  // Agar card 100% yakunlangan bo'lsa va attemptId bo'lsa, natijalarni ko'rsatamiz
  if (item.successAttemptId && getProgress(item) === 100) {
    router.push({ name: "CardResultPage", params: { attemptId: item.successAttemptId } });
  } else {
    // Aks holda, testni davom ettiramiz
    router.push({ name: "CardTest", params: { cardId: item.id } });
  }
};

// Calculate progress percentage
const getProgress = (card: any) => {
  if (!card.questionsCount || card.questionsCount === 0) return 0;
  const answeredQuestions = (card.successCorrectAnswersCount || 0) + (card.successIncorrectAnswersCount || 0);
  return Math.round((answeredQuestions / card.questionsCount) * 100);
};

// Get progress color
const getProgressColor = (progress: number) => {
  if (progress === 0) return '#E5E7EB';
  if (progress < 50) return '#EF4444';
  if (progress < 80) return '#F59E0B';
  return '#10B981';
};
</script>

<template>
  <div class="modern-page">

    <!-- Cards Grid -->
    <div class="modern-cards-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="modern-card-item"
        :class="{ 'modern-card-item--locked': card.isLocked === false }"
        @click="fetchCard(card)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-title-section">
            <h3 class="card-title">{{ index + 1 }}-Mavzu</h3>
            <div class="lock-badge" :class="{ 'lock-badge--unlocked': card.isLocked === true }">
              <LockIcon v-if="card.isLocked === false" :size="16" />
              <LockOpenIcon v-else :size="16" />
              <span>{{ card.isLocked === true ? 'Ochiq' : 'Yopiq' }}</span>
            </div>
          </div>
        </div>

        <!-- Card Name -->
        <div class="card-name-section">
          <p class="card-name">{{ card.name }}</p>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
          <div class="stat-item-large">
            <div class="stat-icon stat-icon--total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Jami savollar</span>
              <span class="stat-value">{{ card.questionsCount || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <button
            class="start-btn"
            :class="{
              'start-btn--locked': card.isLocked === false,
              'start-btn--completed': card.isLocked === true && getProgress(card) === 100
            }"
            @click.stop="fetchCard(card)"
          >
            <span>
              {{ card.isLocked === false ? 'Qulflangan' :
                 getProgress(card) === 100 ? 'Natijalarni ko\'rish' :
                 'Davom etish'
              }}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-page {
  max-width: 1920px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.4s ease;
}


.modern-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.modern-card-item {
  background: white;
  border-radius: 16px;
  border: 1px solid #E8ECF4;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: scaleIn 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(74, 144, 226, 0.15);
    border-color: #4A90E2;
  }

  &--locked {
    opacity: 0.7;
    cursor: not-allowed;

    &:hover {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
    }
  }
}

.card-header {
  margin-bottom: 20px;
}

.card-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.lock-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;

  &--unlocked {
    background: #D1FAE5;
    color: #10B981;
  }
}

.card-name-section {
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #F8F9FC;
  border-radius: 12px;
  border: 1px solid #E8ECF4;
  min-height: 90px;
  display: flex;
  align-items: center;
}

.card-name {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.progress-value {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.stats-section {
  margin-bottom: 20px;
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
}

.stat-item-large {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border-radius: 8px;
  border: 1px solid #E8ECF4;
  width: 100%;
  min-height: 56px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  flex-shrink: 0;

  &--total {
    background: #EFF6FF;
    color: #3B82F6;
  }

  &--answered {
    background: #F0F9FF;
    color: #0EA5E9;
  }

  &--correct {
    background: #D1FAE5;
    color: #10B981;
  }

  &--wrong {
    background: #FEE2E2;
    color: #EF4444;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.stat-label {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.card-footer {
  margin-top: auto;
}

.start-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &--locked {
    background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
    cursor: not-allowed;

    &:hover {
      transform: translateY(0);
      box-shadow: none;
    }
  }

  &--completed {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }
  }
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1280px) {
  .modern-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 960px) {
  .modern-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .modern-page {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .back-btn {
    width: 100%;
  }

  .modern-cards-grid {
    grid-template-columns: 1fr;
  }

  .card-title {
    font-size: 18px;
  }
}
</style>
