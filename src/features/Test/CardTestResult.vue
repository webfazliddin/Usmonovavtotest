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
const isDescriptionVisible = ref(false);
const imageLoading = ref(true);
const imageCache = new Map<string, HTMLImageElement>();

const activeQuestion = computed(() => {
  const question = attempt.value && attempt.value[activeQuestionIndex.value];

  if (question?.question?.fileId) {
    const imageUrl = `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${question.question.fileId}`;
    imageLoading.value = !imageCache.has(imageUrl);
  } else {
    imageLoading.value = false;
  }

  return question;
});

const stats = computed(() => {
  const total = attempt.value.length;
  const correct = attempt.value.filter(q => q.isCorrect).length;
  const answered = attempt.value.filter(q => q.choiceId).length;
  const incorrect = answered - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { total, correct, incorrect, percentage };
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

const preloadAllImages = () => {
  const firstBatch = attempt.value.slice(0, 3);
  firstBatch.forEach((question, index) => {
    if (question?.question?.fileId) {
      const imageUrl = `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${question.question.fileId}`;
      if (imageCache.has(imageUrl)) return;
      const img = new Image();
      img.fetchPriority = 'high';
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.set(imageUrl, img);
        if (index === activeQuestionIndex.value) imageLoading.value = false;
      };
      img.onerror = () => {
        if (index === activeQuestionIndex.value) imageLoading.value = false;
      };
      img.src = imageUrl;
    }
  });

  setTimeout(() => {
    attempt.value.slice(3, 10).forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${question.question.fileId}`;
        if (imageCache.has(imageUrl)) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => imageCache.set(imageUrl, img);
        img.src = imageUrl;
      }
    });
  }, 500);

  setTimeout(() => {
    attempt.value.slice(10).forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${question.question.fileId}`;
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
  const imageUrl = `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${activeQuestion.value.question.fileId}`;
  if (imageCache.has(imageUrl)) imageLoading.value = false;
};

const nextAttemp = () => {
  if (activeQuestionIndex.value === attempt.value.length - 1) return;
  activeQuestionIndex.value++;
  checkImageCache();
  isDescriptionVisible.value = false;
};

const prevAttemp = () => {
  if (activeQuestionIndex.value === 0) return;
  activeQuestionIndex.value--;
  checkImageCache();
  isDescriptionVisible.value = false;
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
  checkImageCache();
  isDescriptionVisible.value = false;
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (!activeQuestion.value) return;

  if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
    }
    return;
  }

  if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
    if (activeQuestionIndex.value > 0) {
      event.preventDefault();
      prevAttemp();
    }
    return;
  }

  if (event.code === 'Enter' || event.key === 'Enter') {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
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
  <div class="result-container">
    <!-- Header -->
    <div class="result-header">
      <div class="header-left">
        <button class="back-btn" @click="emits('goTests')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="header-info">
          <span class="header-title">Natijalar</span>
          <span class="header-sub">Savol {{ activeQuestionIndex + 1 }} / {{ attempt.length }}</span>
        </div>
      </div>

      <div class="header-stats">
        <div class="h-stat h-stat--correct">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ stats.correct }}</span>
        </div>
        <div class="h-stat h-stat--wrong">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>{{ stats.incorrect }}</span>
        </div>
        <div class="h-stat h-stat--pct">
          <span>{{ stats.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${((activeQuestionIndex + 1) / attempt.length) * 100}%` }"></div>
    </div>

    <!-- Content -->
    <div class="result-content" v-if="activeQuestion">
      <div class="content-layout">
        <!-- Question side -->
        <div class="question-side">
          <div class="q-card">
            <span class="q-badge">Savol {{ activeQuestionIndex + 1 }}</span>
            <h2 class="q-text">{{ activeQuestion.question.questionText }}</h2>
          </div>

          <div class="answers">
            <AnswerCard
              v-for="(answer, index) in activeQuestion.question.choices"
              :key="answer.id"
              :item="answer"
              :question="activeQuestion"
              :active-question="activeQuestion"
              :index="index"
              :active="activeQuestion.choiceId == answer.id"
              :disabled="true"
            />
          </div>

          <button
            v-if="activeQuestion.question?.description"
            class="desc-toggle"
            @click="isDescriptionVisible = !isDescriptionVisible"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {{ isDescriptionVisible ? "Izohni berkitish" : "Izohni ko'rish" }}
          </button>

          <div v-if="isDescriptionVisible && activeQuestion.question?.description" class="desc-box">
            {{ activeQuestion.question.description }}
          </div>
        </div>

        <!-- Image side -->
        <div class="image-side">
          <div class="img-wrap">
            <div v-if="imageLoading" class="img-loading">
              <v-progress-circular indeterminate color="#5D87FF" :size="40" :width="3"></v-progress-circular>
            </div>
            <img
              v-show="!imageLoading"
              :src="activeQuestion?.question?.fileId ? `https://api.usmonov-avtomaktab.uz/api/Files?fileName=${activeQuestion.question.fileId}` : defaultImage"
              class="q-image"
              @load="() => imageLoading = false"
              @error="() => imageLoading = false"
              :alt="`Savol ${activeQuestionIndex + 1}`"
              decoding="async"
              crossorigin="anonymous"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer navigator -->
    <div class="result-footer">
      <button class="nav-btn" @click="prevAttemp()" :disabled="activeQuestionIndex === 0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div class="q-navigator" v-if="attempt.length">
        <div
          v-for="(n, i) in attempt"
          :key="i"
          class="nav-num"
          :class="{
            'nav-num--active': i === activeQuestionIndex,
            'nav-num--correct': n.isCorrect && i !== activeQuestionIndex,
            'nav-num--wrong': n.choiceId && !n.isCorrect && i !== activeQuestionIndex,
          }"
          @click="setActiveQuestionIndex(i)"
        >
          {{ i + 1 }}
        </div>
      </div>

      <button class="nav-btn" @click="nextAttemp()" :disabled="activeQuestionIndex === attempt.length - 1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result-container {
  font-family: 'Poppins', sans-serif;
  width: 100vw;
  height: 100vh;
  background: #f4f5f7;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

// Header
.result-header {
  background: white;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.back-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f7;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s;

  &:hover {
    background: #e5e7eb;
  }
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.header-sub {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.h-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;

  &--correct {
    background: #ecfdf5;
    color: #10B981;
  }

  &--wrong {
    background: #fef2f2;
    color: #EF4444;
  }

  &--pct {
    background: #f4f5f7;
    color: #1f2937;
  }
}

// Progress
.progress-track {
  height: 3px;
  background: #e5e7eb;
}

.progress-fill {
  height: 100%;
  background: #5D87FF;
  transition: width 0.3s ease;
}

// Content
.result-content {
  flex: 1;
  padding: 24px;
  padding-bottom: 80px;
  overflow-y: auto;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.question-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.q-card {
  background: white;
  border-radius: 14px;
  padding: 22px;
}

.q-badge {
  display: inline-block;
  background: #eef2ff;
  color: #5D87FF;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.q-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.answers {
  display: flex;
  flex-direction: column;
}

.desc-toggle {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #5D87FF;
  cursor: pointer;

  &:hover {
    background: #f4f5f7;
  }
}

.desc-box {
  background: #fef3c7;
  border-radius: 10px;
  padding: 14px;
  font-size: 14px;
  color: #92400e;
  line-height: 1.6;
}

// Image
.image-side {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: sticky;
  top: 20px;
}

.img-wrap {
  background: white;
  border-radius: 14px;
  padding: 14px;
  width: 100%;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
}

.q-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: contain;
  max-height: 600px;
  min-height: 280px;
}

// Footer
.result-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 101;
}

.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f7;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #6b7280;
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #e5e7eb;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.q-navigator {
  flex: 1;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
}

.nav-num {
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f7;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }

  &--active {
    background: #5D87FF;
    color: white;
  }

  &--correct {
    background: #10B981;
    color: white;
  }

  &--wrong {
    background: #EF4444;
    color: white;
  }
}

// Tablet
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .image-side {
    position: relative;
    top: 0;
  }

  .img-wrap {
    min-height: 280px;
  }
}

// Mobile
@media (max-width: 768px) {
  .result-header {
    padding: 10px 14px;
  }

  .header-title {
    font-size: 14px;
  }

  .header-sub {
    font-size: 11px;
  }

  .header-stats {
    gap: 4px;
  }

  .h-stat {
    padding: 4px 10px;
    font-size: 12px;
    gap: 3px;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  .result-content {
    padding: 10px;
    padding-bottom: 70px;
  }

  .content-layout {
    gap: 12px;
  }

  .q-card {
    padding: 14px;
    border-radius: 10px;
  }

  .q-badge {
    font-size: 11px;
    padding: 3px 10px;
    margin-bottom: 10px;
  }

  .q-text {
    font-size: 15px;
  }

  .img-wrap {
    min-height: 200px;
    padding: 10px;
    border-radius: 10px;
  }

  .q-image {
    max-height: 300px;
    min-height: 180px;
  }

  .result-footer {
    padding: 8px 10px;
    gap: 6px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .q-navigator {
    gap: 4px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .nav-num {
    min-width: 34px;
    height: 34px;
    font-size: 12px;
    border-radius: 8px;
  }

  .desc-toggle {
    font-size: 12px;
    padding: 8px 12px;
  }

  .desc-box {
    font-size: 13px;
    padding: 10px;
  }
}

// Small mobile
@media (max-width: 375px) {
  .back-btn {
    width: 34px;
    height: 34px;
  }

  .h-stat {
    padding: 3px 8px;
    font-size: 11px;
  }

  .q-text {
    font-size: 14px;
  }

  .nav-num {
    min-width: 30px;
    height: 30px;
    font-size: 11px;
  }
}

// Landscape
@media (max-width: 768px) and (orientation: landscape) {
  .content-layout {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .q-card {
    padding: 10px;
  }

  .q-text {
    font-size: 14px;
  }

  .img-wrap {
    min-height: 180px;
  }

  .q-image {
    max-height: 220px;
    min-height: 140px;
  }

  .result-footer {
    padding: 6px 12px;
  }
}
</style>
