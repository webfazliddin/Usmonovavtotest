<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AttemptsReportService } from "@/services/services/AttemptsReport.service";
import { ExamService } from "@/services/services/Exam.service";
import { notify } from "@kyvg/vue3-notification";
import { IAttemptDetails, IExamAttemptData } from "@/features/Exam/types";
import defaultImage from "@/assets/images/car.jpg";

const route = useRoute();
const router = useRouter();

const allAttempts = ref<IAttemptDetails[]>([]);
const selectedAttemptIndex = ref(0);
const loading = ref(false);
const questionsLoading = ref(false);
const activeQuestionIndex = ref(0);
const questions = ref<IExamAttemptData[]>([]);

const attemptDetails = computed(() => {
  if (allAttempts.value.length === 0) return null;
  return allAttempts.value[selectedAttemptIndex.value];
});

const activeQuestion = computed(() => {
  if (questions.value.length === 0) return null;
  return questions.value[activeQuestionIndex.value];
});

const selectAttempt = (index: number) => {
  selectedAttemptIndex.value = index;
  activeQuestionIndex.value = 0;
};

// Load questions when selected attempt changes
watch(() => selectedAttemptIndex.value, () => {
  const attempt = attemptDetails.value;
  if (attempt) {
    fetchQuestions(attempt.attemptId);
  }
});

const fetchDetails = async () => {
  loading.value = true;
  try {
    const userId = Number(route.params.userId);
    const { data } = await AttemptsReportService.GetUserAttemptDetails(userId, 4);

    // API returns { attempts: [...] }
    if (data.attempts && Array.isArray(data.attempts)) {
      allAttempts.value = data.attempts;
    } else if (Array.isArray(data)) {
      allAttempts.value = data;
    } else {
      allAttempts.value = [data];
    }

    // Load questions for the first attempt
    if (allAttempts.value.length > 0) {
      await fetchQuestions(allAttempts.value[0].attemptId);
    }
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

const fetchQuestions = async (attemptId: number) => {
  questionsLoading.value = true;
  try {
    const { data } = await ExamService.GetAttemptResult(attemptId);
    questions.value = Array.isArray(data) ? data : [];
  } catch (error: any) {
    questions.value = [];
  } finally {
    questionsLoading.value = false;
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
  const isUserChoice = choiceId === activeQuestion.value.choiceId;

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
      <!-- Top Bar -->
      <div class="top-bar">
        <button class="back-button" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div class="top-bar-left">
          <h1 class="top-bar-title">Imtihon natijalari</h1>
          <div class="top-bar-meta">
            <span class="meta-tag">{{ attemptDetails.testTypeName }}</span>
            <span class="meta-date">{{ formatDate(attemptDetails.startedDate) }}</span>
          </div>
        </div>

        <div class="top-bar-stats">
          <div class="stat-item">
            <span class="stat-number">{{ attemptDetails.totalQuestions }}</span>
            <span class="stat-label">Jami</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item stat-correct">
            <span class="stat-number">{{ attemptDetails.correctAnswers }}</span>
            <span class="stat-label">To'g'ri</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item stat-incorrect">
            <span class="stat-number">{{ attemptDetails.wrongAnswers }}</span>
            <span class="stat-label">Noto'g'ri</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" :class="attemptDetails.isPassed ? 'stat-passed' : 'stat-failed'">
            <span class="stat-number">{{ attemptDetails.successRate }}%</span>
            <span class="stat-label">{{ attemptDetails.isPassed ? "O'tdi" : "O'tmadi" }}</span>
          </div>
        </div>
      </div>

      <!-- Attempt Selector (when multiple attempts exist) -->
      <div v-if="allAttempts.length > 1" class="attempt-selector">
        <h3 class="selector-title">Urinishlar ({{ allAttempts.length }})</h3>
        <div class="selector-list">
          <button
            v-for="(attempt, index) in allAttempts"
            :key="attempt.attemptId"
            class="selector-btn"
            :class="{ active: selectedAttemptIndex === index, passed: attempt.isPassed }"
            @click="selectAttempt(index)"
          >
            <span class="selector-number">#{{ index + 1 }}</span>
            <span class="selector-score">{{ attempt.correctAnswers }}/{{ attempt.totalQuestions }}</span>
            <span class="selector-percent">{{ attempt.successRate }}%</span>
            <span class="selector-date">{{ formatDate(attempt.startedDate) }}</span>
          </button>
        </div>
      </div>

      <!-- Questions Loading -->
      <div v-if="questionsLoading" class="loading-container">
        <v-progress-circular indeterminate color="primary" :size="40"></v-progress-circular>
      </div>

      <!-- Question Navigator -->
      <div v-else-if="questions.length > 0" class="question-navigator">
        <h3 class="navigator-title">Savollar</h3>
        <div class="navigator-grid">
          <button
            v-for="(q, index) in questions"
            :key="index"
            class="navigator-btn"
            :class="{
              'active': index === activeQuestionIndex,
              'correct': q.isCorrect === true,
              'incorrect': q.choiceId !== null && q.isCorrect === false
            }"
            @click="setActiveQuestion(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>

      <div v-else class="empty-questions">
        <p>Savollar topilmadi yoki imtihon hali yakunlanmagan</p>
      </div>

      <!-- Question Details -->
      <div v-if="activeQuestion && !questionsLoading" class="question-details">
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
              <h2 class="question-text">{{ activeQuestion.question.questionText }}</h2>
            </div>

            <div class="answers-list">
              <div
                v-for="(choice, index) in activeQuestion.question.choices"
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
                  <div v-else-if="choice.id === activeQuestion.choiceId" class="answer-badge user-badge">
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
                :src="activeQuestion.question.fileId ? `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${activeQuestion.question.fileId}` : defaultImage"
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
  padding: clamp(8px, 2vw, 32px);
  overflow-x: hidden;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.details-container {
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
}

// ─── Top Bar ───
.top-bar {
  background: white;
  border-radius: clamp(10px, 1.5vw, 14px);
  padding: clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 20px);
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 16px);
  margin-bottom: clamp(14px, 2vw, 24px);
}

.back-button {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(30px, 3.5vw, 36px);
  height: clamp(30px, 3.5vw, 36px);
  background: #F3F4F6;
  border: none;
  border-radius: 10px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: clamp(14px, 1.5vw, 18px);
    height: clamp(14px, 1.5vw, 18px);
  }

  &:hover {
    background: #EEF2FF;
    color: #5D87FF;
  }
}

.top-bar-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.top-bar-title {
  font-size: clamp(14px, 1.8vw, 18px);
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-bar-meta {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 12px);
}

.meta-tag {
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 600;
  color: #5D87FF;
  background: #EEF2FF;
  padding: 2px clamp(6px, 1vw, 10px);
  border-radius: 6px;
  white-space: nowrap;
}

.meta-date {
  font-size: clamp(10px, 1.2vw, 13px);
  color: #9CA3AF;
  white-space: nowrap;
}

.top-bar-stats {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 0 clamp(8px, 1.8vw, 20px);
}

.stat-number {
  font-size: clamp(15px, 2vw, 20px);
  font-weight: 700;
  color: #1F2937;
}

.stat-label {
  font-size: clamp(9px, 1.1vw, 11px);
  font-weight: 500;
  color: #9CA3AF;
}

.stat-correct .stat-number { color: #10B981; }
.stat-incorrect .stat-number { color: #EF4444; }
.stat-passed .stat-number { color: #10B981; }
.stat-passed .stat-label { color: #10B981; font-weight: 600; }
.stat-failed .stat-number { color: #EF4444; }
.stat-failed .stat-label { color: #EF4444; font-weight: 600; }

.stat-divider {
  width: 1px;
  height: clamp(22px, 3vw, 32px);
  background: #E5E7EB;
  flex-shrink: 0;
}

// ─── Attempt Selector ───
.attempt-selector {
  background: white;
  padding: clamp(12px, 2vw, 24px);
  border-radius: clamp(12px, 1.5vw, 16px);
  margin-bottom: clamp(14px, 2.5vw, 32px);
}

.selector-title {
  font-size: clamp(14px, 1.6vw, 18px);
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 clamp(10px, 1.5vw, 16px) 0;
}

.selector-list {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 12px);
}

.selector-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 10px);
  padding: clamp(8px, 1vw, 12px) clamp(12px, 1.5vw, 20px);
  background: #F9FAFB;
  border: none;
  border-radius: clamp(8px, 1vw, 12px);
  cursor: pointer;
  transition: all 0.2s ease;

  &.active { background: #EEF2FF; }
  &.passed .selector-percent { color: #10B981; }

  .selector-number {
    font-size: clamp(12px, 1.3vw, 14px);
    font-weight: 700;
    color: #5D87FF;
  }

  .selector-score {
    font-size: clamp(12px, 1.3vw, 14px);
    font-weight: 600;
    color: #1F2937;
  }

  .selector-percent {
    font-size: clamp(12px, 1.3vw, 14px);
    font-weight: 700;
    color: #EF4444;
  }

  .selector-date {
    font-size: clamp(10px, 1.1vw, 12px);
    color: #9CA3AF;
  }
}

// ─── Question Navigator ───
.question-navigator {
  background: white;
  padding: clamp(12px, 2vw, 24px);
  border-radius: clamp(12px, 1.5vw, 16px);
  margin-bottom: clamp(14px, 2.5vw, 32px);
}

.navigator-title {
  font-size: clamp(14px, 1.6vw, 18px);
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 clamp(10px, 1.5vw, 16px) 0;
}

.navigator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(36px, 4.5vw, 50px), 1fr));
  gap: clamp(4px, 0.8vw, 10px);
}

.navigator-btn {
  height: clamp(36px, 4.5vw, 50px);
  background: white;
  border: none;
  border-radius: clamp(6px, 1vw, 10px);
  font-size: clamp(12px, 1.3vw, 14px);
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { color: #5D87FF; }
  &.active { background: #5D87FF; color: white; }

  &.correct:not(.active) {
    background: #D1FAE5;
    border: 2px solid #10B981;
    color: #10B981;
  }

  &.incorrect:not(.active) {
    background: #FEE2E2;
    border: 2px solid #EF4444;
    color: #EF4444;
  }
}

.empty-questions {
  background: white;
  padding: clamp(24px, 4vw, 48px) clamp(12px, 2vw, 24px);
  border-radius: clamp(12px, 1.5vw, 16px);
  margin-bottom: clamp(14px, 2.5vw, 32px);
  text-align: center;
  color: #9CA3AF;
  font-size: clamp(13px, 1.4vw, 16px);
  font-weight: 500;
}

// ─── Question Details ───
.question-details {
  background: white;
  padding: clamp(12px, 2.5vw, 32px);
  border-radius: clamp(12px, 1.5vw, 16px);
}

.question-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(14px, 2.5vw, 32px);
}

.question-card {
  background: #F9FAFB;
  padding: clamp(12px, 1.8vw, 20px);
  border-radius: clamp(8px, 1vw, 12px);
  margin-bottom: clamp(12px, 1.8vw, 20px);
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(10px, 1.4vw, 16px);
  flex-wrap: wrap;
  gap: 8px;
}

.question-badge {
  display: inline-block;
  padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1vw, 12px);
  background: #EEF2FF;
  color: #5D87FF;
  border-radius: 8px;
  font-size: clamp(10px, 1.1vw, 12px);
  font-weight: 700;
  text-transform: uppercase;
}

.question-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: clamp(3px, 0.5vw, 6px) clamp(8px, 1vw, 12px);
  background: #FEE2E2;
  color: #EF4444;
  border-radius: 8px;
  font-size: clamp(11px, 1.2vw, 13px);
  font-weight: 600;

  &.correct { background: #D1FAE5; color: #10B981; }

  svg {
    width: clamp(14px, 1.5vw, 18px);
    height: clamp(14px, 1.5vw, 18px);
  }
}

.question-text {
  font-size: clamp(14px, 1.6vw, 18px);
  font-weight: 600;
  color: #1F2937;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

// ─── Answers ───
.answers-list {
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1vw, 12px);
}

.answer-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(8px, 1vw, 12px);
  padding: clamp(10px, 1.4vw, 16px);
  background: #F9FAFB;
  border: none;
  border-radius: clamp(8px, 1vw, 12px);
  transition: all 0.2s ease;

  &.choice-correct { background: #D1FAE5; border: 2px solid #10B981; }
  &.choice-incorrect { background: #FEE2E2; border: 2px solid #EF4444; }
}

.answer-marker {
  width: clamp(26px, 3vw, 32px);
  height: clamp(26px, 3vw, 32px);
  border-radius: clamp(6px, 0.8vw, 8px);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.answer-letter {
  font-size: clamp(11px, 1.3vw, 14px);
  font-weight: 700;
  color: #1F2937;
}

.answer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.answer-text {
  font-size: clamp(13px, 1.4vw, 15px);
  color: #1F2937;
  line-height: 1.5;
}

.answer-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: clamp(2px, 0.4vw, 4px) clamp(6px, 0.8vw, 10px);
  border-radius: 6px;
  font-size: clamp(10px, 1.1vw, 12px);
  font-weight: 600;
  align-self: flex-start;

  &.correct-badge { background: #10B981; color: white; }
  &.user-badge { background: #5D87FF; color: white; }

  svg {
    width: clamp(10px, 1.2vw, 14px);
    height: clamp(10px, 1.2vw, 14px);
  }
}

// ─── Image ───
.image-section {
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.image-container {
  background: #F9FAFB;
  border-radius: clamp(8px, 1vw, 12px);
  padding: clamp(8px, 1.4vw, 16px);
}

.question-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  max-height: clamp(250px, 50vw, 600px);
}

// ─── Tablet ───
@media (max-width: 1024px) {
  .question-layout {
    grid-template-columns: 1fr;
  }

  .image-section {
    position: relative;
    top: 0;
    order: -1;
  }
}

// ─── Mobile ───
@media (max-width: 768px) {
  .top-bar {
    flex-wrap: wrap;
  }

  .top-bar-stats {
    width: 100%;
    justify-content: space-around;
    border-top: 1px solid #F3F4F6;
    padding-top: 10px;
  }

  .selector-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar { height: 3px; }
    &::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
  }

  .selector-btn {
    flex-shrink: 0;

    .selector-date { display: none; }
  }

  .loading-container {
    min-height: 200px;
  }
}
</style>
