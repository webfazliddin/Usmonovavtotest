<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from "vue";
import { ICategoryAttempData } from "./types";
import AnswerCard from "./AnswerCard.vue";
import { ExamService } from "@/services/services/Exams.service";
import { setError } from "@/utils/helpers";
import defaultImage from "@/assets/images/car.jpg";

interface IProps {
  modelValue?: boolean;
  attempId: number;
  view?: boolean;
}

const props = defineProps<IProps>();
const { attempId } = toRefs(props);

const emits = defineEmits(["update:modelValue", "goTests"]);

const attempt = ref<ICategoryAttempData[]>([]);
const activeQuestionIndex = ref(0);
const imageLoading = ref(true);
const imageCache = new Map<string, HTMLImageElement>();
const isDescriptionVisible = ref(false);

const activeQuestion = computed(() => {
  const question = attempt.value && attempt.value[activeQuestionIndex.value];

  // Check if image is already cached
  if (question?.question?.fileId) {
    const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
    imageLoading.value = !imageCache.has(imageUrl);
  } else {
    imageLoading.value = false;
  }

  return question;
});

// Calculate statistics
const stats = computed(() => {
  const total = attempt.value.length;
  const answered = attempt.value.filter(q => q.choiceId).length;
  const correct = attempt.value.filter(q => q.isCorrect).length;
  const incorrect = answered - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    answered,
    correct,
    incorrect,
    percentage
  };
});

const fetchAttemp = () => {
  ExamService.GetExmasResultByAttemp(attempId.value)
    .then((res) => {
      attempt.value = res.data;
      preloadAllImages();
    })
    .catch((e) => {
      setError(e);
    });
};

// Aggressively preload ALL images
const preloadAllImages = () => {
  // First batch
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
        if (index === activeQuestionIndex.value) {
          imageLoading.value = false;
        }
      };

      img.src = imageUrl;
    }
  });

  // Second batch
  setTimeout(() => {
    const secondBatch = attempt.value.slice(3, 10);
    secondBatch.forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
        if (imageCache.has(imageUrl)) return;

        const img = new Image();
        img.fetchPriority = 'high';
        img.crossOrigin = 'anonymous';
        img.onload = () => imageCache.set(imageUrl, img);
        img.src = imageUrl;
      }
    });
  }, 500);

  // Third batch
  setTimeout(() => {
    const remainingBatch = attempt.value.slice(10);
    remainingBatch.forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
        if (imageCache.has(imageUrl)) return;

        const img = new Image();
        img.fetchPriority = 'low';
        img.crossOrigin = 'anonymous';
        img.onload = () => imageCache.set(imageUrl, img);
        img.src = imageUrl;
      }
    });
  }, 1500);
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

const nextAttemp = () => {
  if (activeQuestionIndex.value === attempt.value.length - 1) return;
  activeQuestionIndex.value = activeQuestionIndex.value + 1;
  checkImageCache();
  isDescriptionVisible.value = false;
};

const prevAttemp = () => {
  if (activeQuestionIndex.value === 0) return;
  activeQuestionIndex.value = activeQuestionIndex.value - 1;
  checkImageCache();
  isDescriptionVisible.value = false;
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
  checkImageCache();
  isDescriptionVisible.value = false;
};

// Keyboard navigation
const handleKeyPress = (event: KeyboardEvent) => {
  if (!activeQuestion.value) return;

  // Arrow Right - next question
  if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
    }
    return;
  }

  // Arrow Left - previous question
  if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
    if (activeQuestionIndex.value > 0) {
      event.preventDefault();
      prevAttemp();
    }
    return;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

fetchAttemp();
</script>

<template>
  <div class="modern-result-container">
    <!-- Header with statistics -->
    <div class="result-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="result-title">Test Natijalari</h1>
          <p class="result-subtitle">Savollar: {{ activeQuestionIndex + 1 }} / {{ attempt.length }}</p>
        </div>
        <div class="stats-section">
          <div class="stat-item success">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ stats.correct }}</span>
          </div>
          <div class="stat-item error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>{{ stats.incorrect }}</span>
          </div>
          <div class="stat-item percentage" :class="{ 'high': stats.percentage >= 80, 'medium': stats.percentage >= 50 && stats.percentage < 80 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ stats.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="result-content" v-if="activeQuestion">
      <div class="result-layout">
        <!-- Left side - Question and answers -->
        <div class="question-section">
          <div class="question-card">
            <div class="question-number-badge">Savol {{ activeQuestionIndex + 1 }}</div>
            <h2 class="question-title">{{ activeQuestion.question.questionText }}</h2>
            <div class="keyboard-hint">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 8h20M2 16h20M6 12h12"/>
              </svg>
              ← →: Oldinga/Orqaga harakatlaning
            </div>
          </div>

          <div class="answers-list">
            <AnswerCard
              v-for="(answer, index) in activeQuestion.question.choices"
              :key="answer.id"
              :item="answer"
              :question="activeQuestion"
              :index="index"
              :active="activeQuestion.choiceId == answer.id"
              :disabled="true"
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
    <div class="result-footer">
      <button class="footer-btn back-btn" @click="emits('goTests')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Ortga
      </button>

      <div class="question-navigator" v-if="attempt.length">
        <div
          v-for="(n, i) in attempt"
          :key="i"
          class="nav-number"
          :class="{
            'active': i === activeQuestionIndex,
            'correct': attempt[i]?.isCorrect,
            'incorrect': attempt[i]?.choiceId && !attempt[i]?.isCorrect,
            'unanswered': !attempt[i]?.choiceId
          }"
          @click="setActiveQuestionIndex(i)"
        >
          {{ i + 1 }}
        </div>
      </div>

      <button
        class="footer-btn next-btn"
        @click="nextAttemp()"
        v-if="activeQuestionIndex !== attempt.length - 1"
      >
        Keyingi savol
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-result-container {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  min-height: 100vh;
  background: #F8FAFB;
  display: flex;
  flex-direction: column;
}

.result-header {
  background: linear-gradient(135deg, #5D87FF 0%, #4A7FCC 100%);
  padding: 24px 32px;
  box-shadow: 0 4px 12px rgba(93, 135, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title-section {
  color: white;
}

.result-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.result-subtitle {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.stats-section {
  display: flex;
  gap: 24px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);

  svg {
    flex-shrink: 0;
  }

  span {
    font-size: 20px;
    font-weight: 700;
    color: white;
  }

  &.success {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.3);

    svg {
      color: #10B981;
      filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.5));
    }
  }

  &.error {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);

    svg {
      color: #EF4444;
      filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
    }
  }

  &.percentage {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.3);

    svg {
      color: white;
    }

    &.high {
      background: rgba(16, 185, 129, 0.3);
      border-color: rgba(16, 185, 129, 0.4);

      svg {
        color: #10B981;
      }
    }

    &.medium {
      background: rgba(251, 191, 36, 0.3);
      border-color: rgba(251, 191, 36, 0.4);

      svg {
        color: #FBBF24;
      }
    }
  }
}

.result-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.result-layout {
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
  border: 1px solid #E8ECF4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  border: 1px solid #E8ECF4;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #5D87FF;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #F0F4F8;
    border-color: #5D87FF;
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
  border: 1px solid #E8ECF4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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

@media (min-width: 1400px) {
  .test-image {
    max-height: 700px;
  }
}

@media (max-width: 1024px) {
  .image-section {
    position: relative;
    top: 0;
  }

  .image-container {
    min-height: 300px;
  }

  .test-image {
    max-height: 500px;
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .image-container {
    min-height: 250px;
    padding: 12px;
  }

  .test-image {
    max-height: 400px;
    min-height: 200px;
  }

  .image-loading {
    min-height: 250px;
  }
}

.result-footer {
  background: white;
  padding: 20px 32px;
  border-top: 1px solid #E8ECF4;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
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
    background: linear-gradient(135deg, #5D87FF 0%, #4A7FCC 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(93, 135, 255, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(93, 135, 255, 0.4);
      transform: translateY(-1px);
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
    box-shadow: 0 2px 8px rgba(93, 135, 255, 0.3);
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

  &.unanswered {
    background: #F3F4F6;
    border-color: #D1D5DB;
    color: #9CA3AF;
  }
}

// Tablet styles
@media (max-width: 1024px) {
  .result-layout {
    grid-template-columns: 1fr;
  }

  .result-header {
    padding: 20px 24px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .stats-section {
    width: 100%;
    justify-content: space-between;
  }

  .result-content {
    padding: 20px;
  }

  .result-footer {
    padding: 16px 20px;
    flex-wrap: wrap;
  }

  .question-navigator {
    width: 100%;
    order: -1;
  }

  .question-card {
    padding: 20px;
  }

  .question-title {
    font-size: 18px;
  }

  .image-container {
    min-height: 350px;
  }
}

// Mobile styles
@media (max-width: 768px) {
  .result-header {
    padding: 16px;
  }

  .result-title {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .result-subtitle {
    font-size: 14px;
  }

  .stats-section {
    gap: 12px;
  }

  .stat-item {
    padding: 10px 14px;
    border-radius: 10px;

    span {
      font-size: 18px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .result-content {
    padding: 12px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .result-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .question-card {
    padding: 16px;
    border-radius: 12px;
  }

  .question-number-badge {
    font-size: 11px;
    padding: 4px 10px;
    margin-bottom: 12px;
  }

  .question-title {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .keyboard-hint {
    font-size: 11px;
    padding: 6px 10px;
    flex-wrap: wrap;
    line-height: 1.4;
  }

  .answers-list {
    gap: 8px;
  }

  .description-toggle {
    padding: 10px 14px;
    font-size: 13px;
  }

  .description-box {
    padding: 12px;
    font-size: 13px;
    border-radius: 10px;
  }

  .result-footer {
    padding: 12px 16px;
    gap: 12px;
    flex-wrap: nowrap;
  }

  .footer-btn {
    padding: 10px 16px;
    font-size: 13px;
    border-radius: 8px;

    svg {
      width: 16px;
      height: 16px;
    }

    &.back-btn {
      flex: 0 0 auto;
      min-width: 80px;
    }

    &.next-btn {
      flex: 0 0 auto;
      min-width: 120px;
    }
  }

  .question-navigator {
    flex: 1;
    gap: 6px;
    padding: 2px 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 3px;
    }
  }

  .nav-number {
    min-width: 36px;
    height: 36px;
    font-size: 13px;
    border-radius: 8px;
  }
}

// Small mobile
@media (max-width: 375px) {
  .result-header {
    padding: 12px;
  }

  .result-title {
    font-size: 20px;
  }

  .result-subtitle {
    font-size: 13px;
  }

  .stat-item {
    padding: 8px 12px;
    gap: 6px;

    span {
      font-size: 16px;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .result-content {
    padding: 10px;
  }

  .question-card {
    padding: 14px;
  }

  .question-title {
    font-size: 15px;
  }

  .keyboard-hint {
    font-size: 10px;
    padding: 5px 8px;
  }

  .footer-btn {
    padding: 8px 12px;
    font-size: 12px;

    &.back-btn {
      min-width: 70px;
    }

    &.next-btn {
      min-width: 100px;
    }
  }

  .nav-number {
    min-width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

// Landscape mode for mobile
@media (max-width: 768px) and (orientation: landscape) {
  .result-header {
    padding: 12px 16px;
  }

  .result-content {
    padding: 12px 16px;
  }

  .result-layout {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .question-card {
    padding: 12px;
  }

  .question-title {
    font-size: 14px;
  }

  .image-container {
    min-height: 200px;
  }

  .test-image {
    max-height: 250px;
    min-height: 150px;
  }

  .result-footer {
    padding: 8px 16px;
  }
}
</style>
