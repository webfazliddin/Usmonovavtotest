<script setup lang="ts">
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { LockIcon, LockOpenIcon, CheckIcon, XIcon } from "vue-tabler-icons";

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
  if (!item?.isLocked) return;

  // Agar card 100% yakunlangan bo'lsa va attemptId bo'lsa, natijalarni ko'rsatamiz
  if (item.lastAttemptId && getProgress(item) === 100) {
    router.push({ name: "CardResultPage", params: { attemptId: item.lastAttemptId } });
  } else {
    // Aks holda, testni davom ettiramiz
    router.push({ name: "CardTest", params: { cardId: item.id } });
  }
};

// Calculate progress percentage
const getProgress = (card: any) => {
  if (!card.totalQuestions || card.totalQuestions === 0) return 0;
  return Math.round((card.answeredQuestions / card.totalQuestions) * 100);
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
    <!-- Page Header -->
    <div class="page-header">
      <button class="back-btn" @click="router.back()">
        <span>{{ $t("back") }}</span>
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="modern-cards-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="modern-card-item"
        :class="{ 'modern-card-item--locked': !card.isLocked }"
        @click="fetchCard(card)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-title-section">
            <h3 class="card-title">{{ card.name }}</h3>
            <div class="lock-badge" :class="{ 'lock-badge--unlocked': card.isLocked }">
              <LockIcon v-if="!card.isLocked" :size="16" />
              <LockOpenIcon v-else :size="16" />
              <span>{{ card.isLocked ? 'Ochiq' : 'Yopiq' }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">{{ $t("Progress") }}</span>
            <span class="progress-value">{{ getProgress(card) }}%</span>
          </div>
          <div class="progress-bar-container">
            <div
              class="progress-bar-fill"
              :style="{
                width: `${getProgress(card)}%`,
                backgroundColor: getProgressColor(getProgress(card))
              }"
            ></div>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon stat-icon--total">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Jami savollar</span>
              <span class="stat-value">{{ card.totalQuestions || 0 }}</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon stat-icon--answered">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">Javob berilgan</span>
              <span class="stat-value">{{ card.answeredQuestions || 0 }}</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon stat-icon--correct">
              <CheckIcon :size="20" />
            </div>
            <div class="stat-content">
              <span class="stat-label">To'g'ri</span>
              <span class="stat-value">{{ card.correctAnswers || 0 }}</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon stat-icon--wrong">
              <XIcon :size="20" />
            </div>
            <div class="stat-content">
              <span class="stat-label">Xato</span>
              <span class="stat-value">{{ card.wrongAnswers || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <button
            class="start-btn"
            :class="{
              'start-btn--locked': !card.isLocked,
              'start-btn--completed': card.isLocked && getProgress(card) === 100
            }"
            @click.stop="fetchCard(card)"
          >
            <span>
              {{ !card.isLocked ? 'Qulflangan' :
                 getProgress(card) === 100 ? 'Natijalarni ko\'rish' :
                 'Davom etish'
              }}
            </span>
            <svg v-if="getProgress(card) === 100 && card.isLocked" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.back-btn {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8F9FC;
  border-radius: 10px;
  border: 1px solid #E8ECF4;
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
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
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.card-footer {
  margin-top: 20px;
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

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
