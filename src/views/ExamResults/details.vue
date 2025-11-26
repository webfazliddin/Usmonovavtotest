<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AttemptsReportService } from "@/services/services/AttemptsReport.service";
import { notify } from "@kyvg/vue3-notification";
import { IAttemptDetails } from "@/features/Exam/types";
import defaultImage from "@/assets/images/car.jpg";

const route = useRoute();
const router = useRouter();

const attemptDetails = ref<IAttemptDetails | null>(null);
const loading = ref(false);
const activeQuestionIndex = ref(0);

const activeQuestion = computed(() => {
  if (!attemptDetails.value?.questions) return null;
  return attemptDetails.value.questions[activeQuestionIndex.value];
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const attemptId = Number(route.params.attemptId);
    const { data } = await AttemptsReportService.GetUserAttemptDetails(attemptId);
    attemptDetails.value = data;
  } catch (error: any) {
    notify({
      text: error.response?.data?.message || "Ma'lumotlarni yuklashda xatolik yuz berdi",
      type: "error",
    });
    router.back();
  } finally {
    loading.value = false;
  }
};

const setActiveQuestion = (index: number) => {
  activeQuestionIndex.value = index;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getChoiceClass = (choiceId: number) => {
  if (!activeQuestion.value) return "";

  const isCorrect = choiceId === activeQuestion.value.correctChoiceId;
  const isUserChoice = choiceId === activeQuestion.value.userChoiceId;

  if (isCorrect) return "choice-correct";
  if (isUserChoice && !isCorrect) return "choice-incorrect";
  return "";
};

onMounted(() => {
  fetchDetails();
});
</script>

<template>
  <div class="details-page">
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" :size="60"></v-progress-circular>
    </div>

    <div v-else-if="attemptDetails" class="details-container">
      <!-- Header -->
      <div class="details-header">
        <button class="back-button" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Orqaga
        </button>

        <div class="header-info">
          <h1 class="header-title">Imtihon natijalari - Batafsil</h1>
          <div class="header-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{{ attemptDetails.userName }} ({{ attemptDetails.userEmail }})</span>
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ formatDate(attemptDetails.completedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Jami savollar</span>
            <span class="stat-value">{{ attemptDetails.totalQuestions }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-correct">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">To'g'ri javoblar</span>
            <span class="stat-value">{{ attemptDetails.correctAnswers }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-incorrect">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Noto'g'ri javoblar</span>
            <span class="stat-value">{{ attemptDetails.incorrectAnswers }}</span>
          </div>
        </div>

        <div class="stat-card stat-card-result" :class="{ 'passed': attemptDetails.percentage >= 90 }">
          <div class="stat-icon stat-icon-percentage">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Natija</span>
            <span class="stat-value">{{ attemptDetails.percentage }}%</span>
            <span class="stat-status">{{ attemptDetails.percentage >= 90 ? "O'tdi" : "O'tmadi" }}</span>
          </div>
        </div>
      </div>

      <!-- Question Navigator -->
      <div class="question-navigator">
        <h3 class="navigator-title">Savollar</h3>
        <div class="navigator-grid">
          <button
            v-for="(question, index) in attemptDetails.questions"
            :key="question.questionId"
            class="navigator-btn"
            :class="{
              'active': index === activeQuestionIndex,
              'correct': question.isCorrect,
              'incorrect': !question.isCorrect
            }"
            @click="setActiveQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>

      <!-- Question Details -->
      <div v-if="activeQuestion" class="question-details">
        <div class="question-layout">
          <!-- Left: Question and Answers -->
          <div class="question-section">
            <div class="question-card">
              <div class="question-header">
                <span class="question-badge">Savol {{ activeQuestionIndex + 1 }}</span>
                <div class="question-status" :class="{ 'correct': activeQuestion.isCorrect }">
                  <svg v-if="activeQuestion.isCorrect" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>{{ activeQuestion.isCorrect ? "To'g'ri" : "Noto'g'ri" }}</span>
                </div>
              </div>
              <h2 class="question-text">{{ activeQuestion.questionText }}</h2>
            </div>

            <div class="answers-list">
              <div
                v-for="(choice, index) in activeQuestion.choices"
                :key="choice.id"
                class="answer-item"
                :class="getChoiceClass(choice.id)"
              >
                <div class="answer-marker">
                  <span class="answer-letter">{{ String.fromCharCode(65 + index) }}</span>
                </div>
                <div class="answer-content">
                  <span class="answer-text">{{ choice.choiceText }}</span>
                  <div v-if="choice.id === activeQuestion.correctChoiceId" class="answer-badge correct-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    To'g'ri javob
                  </div>
                  <div v-else-if="choice.id === activeQuestion.userChoiceId" class="answer-badge user-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Foydalanuvchi javobi
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Image -->
          <div class="image-section">
            <div class="image-container">
              <img
                :src="activeQuestion.fileId ? `https://api.uatest.uz/api/Files?fileName=${activeQuestion.fileId}` : defaultImage"
                :alt="`Savol ${activeQuestionIndex + 1} rasmi`"
                class="question-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: #F8FAFB;
  padding: 32px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.details-container {
  max-width: 1400px;
  margin: 0 auto;
}

.details-header {
  margin-bottom: 32px;
}

.back-button {
  font-family: 'Poppins', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  color: #6B7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background: #F9FAFB;
    border-color: #5D87FF;
    color: #5D87FF;
  }
}

.header-info {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 16px 0;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;

  svg {
    color: #9CA3AF;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;

  &.stat-card-result {
    border: 2px solid #FEE2E2;

    &.passed {
      border-color: #D1FAE5;
    }
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.stat-icon-total {
    background: #EEF2FF;
    color: #5D87FF;
  }

  &.stat-icon-correct {
    background: #D1FAE5;
    color: #10B981;
  }

  &.stat-icon-incorrect {
    background: #FEE2E2;
    color: #EF4444;
  }

  &.stat-icon-percentage {
    background: #F3E8FF;
    color: #7C3AED;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
}

.stat-status {
  font-size: 12px;
  font-weight: 600;
  color: #EF4444;

  .stat-card-result.passed & {
    color: #10B981;
  }
}

.question-navigator {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 32px;
}

.navigator-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px 0;
}

.navigator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
}

.navigator-btn {
  height: 50px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #5D87FF;
    color: #5D87FF;
  }

  &.active {
    background: #5D87FF;
    border-color: #5D87FF;
    color: white;
  }

  &.correct:not(.active) {
    background: #D1FAE5;
    border-color: #10B981;
    color: #10B981;
  }

  &.incorrect:not(.active) {
    background: #FEE2E2;
    border-color: #EF4444;
    color: #EF4444;
  }
}

.question-details {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.question-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.question-card {
  background: #F9FAFB;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.question-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #EEF2FF;
  color: #5D87FF;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.question-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;

  &.correct {
    background: #D1FAE5;
    color: #10B981;
  }
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #F9FAFB;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  transition: all 0.2s ease;

  &.choice-correct {
    background: #D1FAE5;
    border-color: #10B981;
  }

  &.choice-incorrect {
    background: #FEE2E2;
    border-color: #EF4444;
  }
}

.answer-marker {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.answer-letter {
  font-size: 14px;
  font-weight: 700;
  color: #1F2937;
}

.answer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-text {
  font-size: 15px;
  color: #1F2937;
  line-height: 1.5;
}

.answer-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  align-self: flex-start;

  &.correct-badge {
    background: #10B981;
    color: white;
  }

  &.user-badge {
    background: #5D87FF;
    color: white;
  }
}

.image-section {
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.image-container {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #E5E7EB;
}

.question-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  max-height: 600px;
}

// Responsive
@media (max-width: 1024px) {
  .question-layout {
    grid-template-columns: 1fr;
  }

  .image-section {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .details-page {
    padding: 16px;
  }

  .header-title {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .navigator-grid {
    grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  }

  .question-details {
    padding: 20px;
  }

  .question-text {
    font-size: 16px;
  }
}
</style>
