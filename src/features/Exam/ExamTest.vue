<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { IExamAttemptData, IExamSubmitAnswer } from "./types";
import AnswerCard from "../Test/AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import defaultImage from "@/assets/images/car.jpg";
import { ExamService } from "@/services/services/Exam.service";
import { useRouter } from "vue-router";

const emits = defineEmits(["showResult"]);

const router = useRouter();
const attempt = ref<IExamAttemptData[]>([]);
const activeQuestionIndex = ref(0);
const saveLoading = ref(false);
const isDescriptionVisible = ref(false);
const imageLoading = ref(true);
const imageCache = new Map<string, HTMLImageElement>();

const activeQuestion = computed(() => {
  const question = attempt.value[activeQuestionIndex.value];

  if (question?.question?.fileId) {
    const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
    imageLoading.value = !imageCache.has(imageUrl);
  } else {
    imageLoading.value = false;
  }

  return question;
});

const fetchExam = async () => {
  try {
    const { data } = await ExamService.StartExam(4);
    attempt.value = data.map((item: any) => ({ ...item, canChange: true }));
    preloadAllImages();
  } catch (error: any) {
    notify({
      text: error.response?.data?.message || "Imtihonni boshlashda xatolik yuz berdi",
      type: "error",
    });
  }
};

const preloadAllImages = () => {
  // Load first 3 images immediately
  const firstBatch = attempt.value.slice(0, 3);
  firstBatch.forEach((question, index) => {
    if (question?.question?.fileId) {
      const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
      if (imageCache.has(imageUrl)) return;

      const img = new Image();
      img.fetchPriority = 'high';
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        imageCache.set(imageUrl, img);
        if (index === activeQuestionIndex.value) {
          imageLoading.value = false;
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${imageUrl}`);
        if (index === activeQuestionIndex.value) {
          imageLoading.value = false;
        }
      };

      img.src = imageUrl;
    }
  });

  // Load remaining images
  setTimeout(() => {
    const remainingBatch = attempt.value.slice(3);
    remainingBatch.forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
        if (imageCache.has(imageUrl)) return;

        const img = new Image();
        img.fetchPriority = 'low';
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          imageCache.set(imageUrl, img);
        };

        img.onerror = () => {
          console.error(`Failed to load image: ${imageUrl}`);
        };

        img.src = imageUrl;
      }
    });
  }, 500);
};

const checkImageCache = () => {
  if (!activeQuestion.value?.question?.fileId) {
    imageLoading.value = false;
    return;
  }

  const imageUrl = `https://api.uatest.uz/api/Files?fileName=${activeQuestion.value.question.fileId}`;
  if (imageCache.has(imageUrl)) {
    imageLoading.value = false;
  }
};

const finishExam = () => {
  emits("showResult", activeQuestion.value.attemptId);
};

const nextQuestion = () => {
  if (!activeQuestion.value?.choiceId) return;

  // If already submitted, just move to next question
  if (!activeQuestion.value.canChange) {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      activeQuestionIndex.value = activeQuestionIndex.value + 1;
      checkImageCache();
      isDescriptionVisible.value = false;
    } else {
      // Last question - finish exam
      finishExam();
    }
    return;
  }

  // If not yet submitted, submit first
  const result: IExamSubmitAnswer = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;
  ExamService.SubmitAnswer(activeQuestion.value.attemptId, result)
    .then((res) => {
      activeQuestion.value.isCorrect = res.data.isCorrect;
      activeQuestion.value.correctChoiceId = res.data.correctChoiceId;
      activeQuestion.value.canChange = false;

      if (activeQuestionIndex.value !== attempt.value.length - 1) {
        activeQuestionIndex.value = activeQuestionIndex.value + 1;
        checkImageCache();
        isDescriptionVisible.value = false;
      } else {
        // Last question - finish exam after submission completes
        saveLoading.value = false;
        finishExam();
      }
    })
    .catch((e) => {
      notify({
        text: e.response?.data?.message || "Javobni saqlashda xatolik yuz berdi",
        type: "error",
      });
    })
    .finally(() => {
      if (activeQuestionIndex.value !== attempt.value.length - 1) {
        saveLoading.value = false;
      }
    });
};

const handleAnswerClick = (answerId: number) => {
  if (activeQuestion.value?.canChange) {
    activeQuestion.value.choiceId = answerId;

    // Immediately submit the answer to get feedback
    const result: IExamSubmitAnswer = {
      questionId: activeQuestion.value.question.id,
      choiceId: answerId,
    };

    saveLoading.value = true;
    ExamService.SubmitAnswer(activeQuestion.value.attemptId, result)
      .then((res) => {
        activeQuestion.value.isCorrect = res.data.isCorrect;
        activeQuestion.value.correctChoiceId = res.data.correctChoiceId;
        activeQuestion.value.canChange = false;
      })
      .catch((e) => {
        notify({
          text: e.response?.data?.message || "Javobni saqlashda xatolik yuz berdi",
          type: "error",
        });
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
  checkImageCache();
  isDescriptionVisible.value = false;
};

// Keyboard shortcuts
const handleKeyPress = (event: KeyboardEvent) => {
  if (!activeQuestion.value) return;

  // Arrow Right - next question
  if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
    if (activeQuestion.value.choiceId && activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextQuestion();
    }
    return;
  }

  // Arrow Left - previous question
  if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
    if (activeQuestionIndex.value > 0) {
      event.preventDefault();
      activeQuestionIndex.value--;
      checkImageCache();
      isDescriptionVisible.value = false;
    }
    return;
  }

  // Enter - next question
  if (event.code === 'Enter' || event.key === 'Enter') {
    if (activeQuestion.value.choiceId) {
      event.preventDefault();
      nextQuestion();
    }
    return;
  }

  // F1-F12 keys
  if (!activeQuestion.value.canChange) return;

  const choices = activeQuestion.value.question.choices;

  if (event.code.startsWith('F') && event.code.length >= 2) {
    const keyMatch = event.code.match(/^F(\d+)$/);
    if (keyMatch) {
      event.preventDefault();
      const keyNumber = parseInt(keyMatch[1]);
      const choiceIndex = keyNumber - 1;

      if (choices[choiceIndex]) {
        handleAnswerClick(choices[choiceIndex].id);
      }
    }
  }

  // Number keys 1-9
  if (event.code.match(/^Digit[1-9]$/) || event.key.match(/^[1-9]$/)) {
    event.preventDefault();
    const keyNumber = parseInt(event.key);
    const choiceIndex = keyNumber - 1;

    if (choices[choiceIndex]) {
      handleAnswerClick(choices[choiceIndex].id);
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
  fetchExam();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="exam-test-container">
    <!-- Header -->
    <div class="test-header">
      <div class="question-progress">
        <span class="current-question">Savol {{ activeQuestionIndex + 1 }}</span>
        <span class="total-questions">/ {{ attempt.length }}</span>
      </div>
      <div class="progress-indicator">
        <div class="progress-bar" :style="{ width: `${((activeQuestionIndex + 1) / attempt.length) * 100}%` }"></div>
      </div>
      <div class="exam-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
        <span>Imtihon</span>
      </div>
    </div>

    <!-- Main content -->
    <div class="test-content" v-if="activeQuestion">
      <div class="test-layout">
        <!-- Left side - Question and answers -->
        <div class="question-section">
          <div class="question-card">
            <div class="question-number-badge">Savol {{ activeQuestionIndex + 1 }}</div>
            <h2 class="question-title">{{ activeQuestion.question.questionText }}</h2>
            <div class="keyboard-hint">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 8h20M2 16h20M6 12h12"/>
              </svg>
              F1-F5 yoki 1-5: Javob | ← →: Oldinga/Orqaga | Enter: Keyingi
            </div>
          </div>

          <div class="answers-list">
            <AnswerCard
              v-for="(answer, index) in activeQuestion.question.choices"
              :key="answer.id"
              :item="answer"
              :question="activeQuestion"
              :active-question="activeQuestion"
              :index="index"
              @click="handleAnswerClick(answer.id)"
              :active="activeQuestion.choiceId == answer.id"
            />
          </div>

          <button
            v-if="activeQuestion.question?.description"
            class="description-toggle"
            @click="isDescriptionVisible = !isDescriptionVisible"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {{ isDescriptionVisible ? "Izohni berkitish" : "Izohni ko'rish" }}
          </button>

          <div v-if="isDescriptionVisible && activeQuestion.question?.description" class="description-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>{{ activeQuestion.question.description }}</span>
          </div>
        </div>

        <!-- Right side - Image -->
        <div class="image-section">
          <div class="image-container">
            <div v-if="imageLoading" class="image-loading">
              <v-progress-circular
                indeterminate
                color="#5D87FF"
                :size="50"
                :width="4"
              ></v-progress-circular>
              <p>Rasm yuklanmoqda...</p>
            </div>
            <img
              v-show="!imageLoading"
              :src="activeQuestion?.question?.fileId ? `https://api.uatest.uz/api/Files?fileName=${activeQuestion.question.fileId}` : defaultImage"
              class="test-image"
              @load="() => imageLoading = false"
              @error="() => imageLoading = false"
              :alt="`Savol ${activeQuestionIndex + 1} rasmi`"
              decoding="async"
              crossorigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom navigation -->
    <div class="test-footer">
      <button class="footer-btn back-btn" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Ortga</span>
      </button>

      <div class="question-navigator" v-if="attempt.length">
        <div
          v-for="(n, i) in attempt"
          :key="i"
          class="nav-number"
          :class="{
            'active': i === activeQuestionIndex,
            'answered': attempt[i]?.choiceId,
            'correct': attempt[i]?.isCorrect,
            'incorrect': attempt[i]?.choiceId && !attempt[i]?.isCorrect
          }"
          @click="setActiveQuestionIndex(i)"
        >
          {{ i + 1 }}
        </div>
      </div>

      <button
        class="footer-btn next-btn"
        @click="nextQuestion()"
        :disabled="!activeQuestion?.choiceId || saveLoading"
        :class="{ 'disabled': !activeQuestion?.choiceId || saveLoading }"
      >
        {{
          activeQuestionIndex === attempt.length - 1
            ? "Yakunlash"
            : "Keyingi savol"
        }}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Use same styles as CompleteTest.vue
.exam-test-container {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  min-height: 100vh;
  background: #F8FAFB;
  display: flex;
  flex-direction: column;
}

.test-header {
  background: white;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: 1px solid #E8ECF4;
}

.question-progress {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 120px;
}

.current-question {
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
}

.total-questions {
  font-size: 14px;
  font-weight: 500;
  color: #9CA3AF;
}

.progress-indicator {
  flex: 1;
  height: 8px;
  background: #E8ECF4;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #5D87FF;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.exam-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #7C3AED;
  background: #F3E8FF;
  padding: 8px 16px;
  border-radius: 8px;

  svg {
    color: #7C3AED;
  }
}

.test-content {
  flex: 1;
  padding: 32px;
  padding-bottom: 120px;
  overflow-y: auto;
}

.test-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.question-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
}

.question-number-badge {
  display: inline-block;
  background: #EEF2FF;
  color: #5D87FF;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.question-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  line-height: 1.6;
  margin: 0 0 12px 0;
  white-space: pre-wrap;
}

.keyboard-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6B7280;
  padding: 8px 12px;
  background: #F9FAFB;
  border-radius: 8px;

  svg {
    color: #9CA3AF;
  }
}

.answers-list {
  display: flex;
  flex-direction: column;
}

.description-toggle {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #5D87FF;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #F0F4F8;
  }
}

.description-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #FEF3C7;
  border: 1px solid #FCD34D;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #92400E;
  line-height: 1.6;

  svg {
    color: #F59E0B;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.image-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: sticky;
  top: 20px;
}

.image-container {
  background: white;
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;

  p {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #6B7280;
    margin: 0;
  }
}

.test-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  max-height: 600px;
  min-height: 300px;
  display: block;
  transition: opacity 0.3s ease;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  aspect-ratio: auto;
}

.test-footer {
  background: white;
  padding: 20px 32px;
  border-top: 1px solid #E8ECF4;
  display: flex;
  align-items: center;
  gap: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.footer-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.back-btn {
    background: #F3F4F6;
    color: #6B7280;

    &:hover {
      background: #E5E7EB;
    }
  }

  &.next-btn {
    background: #5D87FF;
    color: white;

    &:disabled,
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #E5E7EB;
      color: #9CA3AF;
      transform: none;
    }
  }
}

.question-navigator {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
}

.nav-number {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #E8ECF4;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #5D87FF;
    color: #5D87FF;
  }

  &.active {
    background: #5D87FF;
    border-color: #5D87FF;
    color: white;
  }

  &.answered {
    background: #E0E7FF;
    border-color: #A5B4FC;
    color: #5D87FF;
  }

  &.correct {
    background: #10B981;
    border-color: #10B981;
    color: white;
  }

  &.incorrect {
    background: #EF4444;
    border-color: #EF4444;
    color: white;
  }
}

// Responsive styles
@media (max-width: 1024px) {
  .test-layout {
    grid-template-columns: 1fr;
  }

  .test-content {
    padding: 20px;
    padding-bottom: 110px;
  }

  .image-section {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .test-header {
    padding: 12px 16px;
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }

  .question-progress {
    width: 100%;
    justify-content: space-between;
  }

  .progress-indicator {
    order: 3;
    width: 100%;
  }

  .test-content {
    padding: 12px;
    padding-bottom: 140px;
  }

  .test-layout {
    gap: 20px;
  }

  .question-card {
    padding: 16px;
  }

  .keyboard-hint {
    font-size: 11px;
    flex-wrap: wrap;
  }

  .test-footer {
    padding: 10px 12px;
    gap: 8px;
    flex-wrap: nowrap;
  }

  .footer-btn {
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 8px;
    white-space: nowrap;

    svg {
      width: 16px;
      height: 16px;
    }

    &.back-btn {
      flex: 0 0 auto;
      padding: 10px;
      min-width: auto;

      span {
        display: none;
      }
    }

    &.next-btn {
      flex: 0 0 auto;
      min-width: 100px;
      font-size: 12px;
    }
  }

  .question-navigator {
    flex: 1;
    gap: 5px;
    padding: 0 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .nav-number {
    min-width: 36px;
    height: 36px;
    font-size: 13px;
    border-radius: 8px;
    touch-action: manipulation;
  }

  .keyboard-hint {
    display: none;
  }

  .question-card {
    padding: 12px;
    border-radius: 10px;
  }

  .question-number-badge {
    font-size: 11px;
    padding: 4px 8px;
    margin-bottom: 8px;
  }

  .question-title {
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .image-section {
    position: relative;
    top: 0;
  }

  .image-container {
    min-height: 220px;
    padding: 10px;
    border-radius: 10px;
  }

  .test-image {
    max-height: 300px;
    min-height: 180px;
    border-radius: 8px;
  }

  .description-toggle {
    padding: 10px 12px;
    font-size: 13px;
  }

  .description-box {
    padding: 12px;
    font-size: 13px;
    border-radius: 10px;
  }
}

@media (max-width: 375px) {
  .test-header {
    padding: 10px 12px;
  }

  .current-question {
    font-size: 15px;
  }

  .test-content {
    padding: 10px;
    padding-bottom: 130px;
  }

  .footer-btn {
    padding: 8px 12px;
    font-size: 12px;

    &.next-btn {
      min-width: 90px;
    }
  }

  .nav-number {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
</style>
