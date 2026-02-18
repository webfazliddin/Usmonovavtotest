<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ExamService } from "@/services/services/Exam.service";
import { notify } from "@kyvg/vue3-notification";

const { t } = useI18n();

const router = useRouter();

interface IExamResult {
  attemptId: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

const examResult = ref<IExamResult | null>(null);
const loading = ref(false);
const hasExam = ref(false);

const fetchCurrentExam = async () => {
  loading.value = true;
  try {
    const { data } = await ExamService.GetCurrentExam();
    if (data && data.length > 0) {
      hasExam.value = true;
      const questions = data;
      const totalQuestions = questions.length;
      const correctCount = questions.filter((a: any) => a.isCorrect === true).length;
      const incorrectCount = questions.filter((a: any) => a.isCorrect === false).length;
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      examResult.value = {
        attemptId: questions[0].attemptId,
        totalQuestions: totalQuestions,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        percentage: percentage,
        passed: percentage >= 90,
        completedAt: new Date().toISOString(),
      };
    } else {
      hasExam.value = false;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      hasExam.value = false;
    } else {
      notify({
        text: error.response?.data?.message || t("errorLoadingData"),
        type: "error",
      });
    }
  } finally {
    loading.value = false;
  }
};

const startNewExam = () => {
  router.push("/exam");
};

const viewDetails = () => {
  if (examResult.value) {
    router.push({ path: "/exam", query: { attemptId: examResult.value.attemptId.toString() } });
  }
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

onMounted(() => {
  fetchCurrentExam();
});
</script>

<template>
  <div class="my-exam-results-page">
    <div class="page-container">
      <div class="page-header">
        <button class="back-button" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {{ $t("back") }}
        </button>
        <h1 class="page-title">{{ $t("myExamResult") }}</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate color="primary" :size="60"></v-progress-circular>
        <p>{{ $t("loading") }}</p>
      </div>

      <!-- No Exam State -->
      <div v-else-if="!hasExam" class="no-exam-state">
        <div class="no-exam-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <h2>{{ $t("noExamYet") }}</h2>
        <p>{{ $t("start-subtitle") }}</p>
        <button class="start-exam-button" @click="startNewExam">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          {{ $t("startExam") }}
        </button>
      </div>

      <!-- Exam Result State -->
      <div v-else-if="examResult" class="result-container">
        <!-- Status Card -->
        <div class="status-card" :class="{ 'passed': examResult.passed }">
          <div class="status-icon">
            <svg v-if="examResult.passed" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h2 class="status-title">
            {{ examResult.passed ? $t("successful") : $t("unsuccessful") }}
          </h2>
          <p class="status-subtitle">
            {{ examResult.passed ? $t("examPassedMessage") : $t("examFailedMessage") }}
          </p>
          <div class="percentage-badge">
            {{ examResult.percentage }}%
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-icon-total">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">{{ $t("totalQuestions") }}</span>
              <span class="stat-value">{{ examResult.totalQuestions }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-correct">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-label">{{ $t("correctAnswers") }}</span>
              <span class="stat-value">{{ examResult.correctAnswers }}</span>
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
              <span class="stat-label">{{ $t("incorrectAnswers") }}</span>
              <span class="stat-value">{{ examResult.incorrectAnswers }}</span>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="info-box" :class="{ 'success': examResult.passed }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div class="info-content">
            <p class="info-title">{{ examResult.passed ? $t("passed") : $t("failed") }}</p>
            <p class="info-text">
              {{ examResult.passed
                ? $t("examPassedDetails", { correctCount: examResult.correctAnswers })
                : $t("examFailedDetails", { correctCount: examResult.correctAnswers })
              }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <button class="detail-button" @click="viewDetails">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {{ $t("viewDetailedResults") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-exam-results-page {
  font-family: 'Poppins', sans-serif;
  background: transparent;
}

.page-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.back-button {
  font-family: 'Poppins', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 10px;
  color: #6B7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background: #F9FAFB;
    color: #5D87FF;
  }
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;

  p {
    font-size: 14px;
    color: #6B7280;
    margin: 0;
  }
}

.no-exam-state {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
}

.no-exam-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #F3E8FF;
  border-radius: 20px;
  margin-bottom: 24px;

  svg {
    color: #7C3AED;
  }
}

.no-exam-state h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
}

.no-exam-state p {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 32px 0;
}

.start-exam-button {
  font-family: 'Poppins', sans-serif;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: #7C3AED;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-card {
  background: white;
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: #FEE2E2;
  border-radius: 50%;
  margin-bottom: 24px;

  .status-card.passed & {
    background: #D1FAE5;
  }

  svg {
    color: #EF4444;

    .status-card.passed & {
      color: #10B981;
    }
  }
}

.status-title {
  font-size: 24px;
  font-weight: 700;
  color: #EF4444;
  margin: 0 0 8px 0;

  .status-card.passed & {
    color: #10B981;
  }
}

.status-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 24px 0;
}

.percentage-badge {
  display: inline-block;
  padding: 12px 32px;
  background: #FEE2E2;
  color: #EF4444;
  font-size: 20px;
  font-weight: 700;
  border-radius: 12px;

  .status-card.passed & {
    background: #D1FAE5;
    color: #10B981;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
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
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #FEF3C7;
  border-radius: 16px;
  padding: 24px;

  &.success {
    background: #D1FAE5;
  }

  svg {
    color: #F59E0B;
    flex-shrink: 0;
    margin-top: 2px;

    .info-box.success & {
      color: #10B981;
    }
  }
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 14px;
  font-weight: 700;
  color: #92400E;
  margin: 0 0 8px 0;

  .info-box.success & {
    color: #065F46;
  }
}

.info-text {
  font-size: 14px;
  color: #92400E;
  line-height: 1.6;
  margin: 0;

  .info-box.success & {
    color: #065F46;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.detail-button {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  padding: 14px 24px;
  background: #5D87FF;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
}

// Responsive
@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .back-button {
    padding: 8px 14px;
    font-size: 13px;
    margin-bottom: 12px;
  }

  .status-card {
    padding: 28px 20px;
    border-radius: 16px;
  }

  .status-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;

    svg {
      width: 36px;
      height: 36px;
    }
  }

  .status-title {
    font-size: 22px;
  }

  .status-subtitle {
    font-size: 14px;
  }

  .percentage-badge {
    font-size: 24px;
    padding: 10px 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    border-radius: 12px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .stat-value {
    font-size: 22px;
  }

  .no-exam-state {
    padding: 40px 20px;
    border-radius: 16px;
  }

  .no-exam-icon {
    width: 80px;
    height: 80px;
    border-radius: 16px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .no-exam-state h2 {
    font-size: 20px;
  }

  .no-exam-state p {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .start-exam-button {
    padding: 12px 24px;
    font-size: 14px;
    width: 100%;
    justify-content: center;
  }

  .info-box {
    padding: 16px;
    border-radius: 12px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .detail-button {
    padding: 12px 20px;
    font-size: 14px;
  }

  .result-container {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .status-card {
    padding: 24px 16px;
  }

  .status-title {
    font-size: 20px;
  }

  .percentage-badge {
    font-size: 22px;
    padding: 8px 20px;
  }
}
</style>
