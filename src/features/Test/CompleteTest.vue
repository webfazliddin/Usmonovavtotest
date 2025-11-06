<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from "vue";
import { ICategoryAttempData, IPostAttemp } from "./types";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { useFormatter } from "@/utils/formatter";
import { ExamService } from "@/services/services/Exams.service";
import defaultImage from "@/assets/images/car.jpg";
import { useRouter } from "vue-router";

interface IProps {
  modelValue?: boolean;
  view?: boolean;
}

const router = useRouter();
const props = defineProps<IProps>();
const { view } = toRefs(props);

const emits = defineEmits(["update:modelValue", "showResult"]);
const { secondsToHms } = useFormatter();

const attempt = ref<ICategoryAttempData[]>([]);
const timer_interval = ref<number | undefined>();
const timer = ref(1200); // 20 minutes
const activeQuestionIndex = ref(0);
const saveLoading = ref(false);
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

const selected = ref<number | null>(null);

const clearTimer = () => clearInterval(timer_interval.value);

const refreshTimer = () => {
  clearTimer();
  timer_interval.value = setInterval(() => {
    if (timer.value === 0) {
      clearTimer();
      return;
    }
    timer.value--;
  }, 1000);
};

const fetchAttemp = () => {
  ExamService.Exmas().then((res) => {
    attempt.value = res.data.map(item => ({ ...item, canChange: true }));
    preloadAllImages();
  });
};

// Aggressively preload ALL images when test starts - OPTIMIZED FOR SPEED
const preloadAllImages = () => {
  // HIGHEST PRIORITY: Load current image IMMEDIATELY (index 0)
  if (attempt.value[0]?.question?.fileId) {
    const currentImageUrl = `https://api.uatest.uz/api/Files?fileName=${attempt.value[0].question.fileId}`;

    const currentImg = new Image();
    currentImg.fetchPriority = 'high';
    currentImg.crossOrigin = 'anonymous';

    currentImg.onload = () => {
      imageCache.set(currentImageUrl, currentImg);
      imageLoading.value = false; // Hide loading immediately
    };

    currentImg.onerror = () => {
      console.error(`Failed to load current image: ${currentImageUrl}`);
      imageLoading.value = false;
    };

    currentImg.src = currentImageUrl;
  } else {
    imageLoading.value = false; // No image for current question
  }

  // Load next 5 images in parallel with high priority (no delay)
  const highPriorityBatch = attempt.value.slice(1, 6);
  highPriorityBatch.forEach((question) => {
    if (question?.question?.fileId) {
      const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
      if (imageCache.has(imageUrl)) return;

      const img = new Image();
      img.fetchPriority = 'high';
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

  // Load next 10 images with medium priority after minimal delay
  setTimeout(() => {
    const mediumPriorityBatch = attempt.value.slice(6, 16);
    mediumPriorityBatch.forEach((question) => {
      if (question?.question?.fileId) {
        const imageUrl = `https://api.uatest.uz/api/Files?fileName=${question.question.fileId}`;
        if (imageCache.has(imageUrl)) return;

        const img = new Image();
        img.fetchPriority = 'high';
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
  }, 200);

  // Load remaining images with lower priority
  setTimeout(() => {
    const remainingBatch = attempt.value.slice(16);
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
  }, 800);
};

// Check if current image is already cached
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
  if (view.value) {
    activeQuestionIndex.value = activeQuestionIndex.value + 1;
    checkImageCache();
    isDescriptionVisible.value = false;
    return;
  }

  if (activeQuestion.value?.choiceId) {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      activeQuestionIndex.value = activeQuestionIndex.value + 1;
      checkImageCache();
      isDescriptionVisible.value = false;
    } else {
      clearTimer();
      emits("showResult", activeQuestion.value.attemptId);
      emits("update:modelValue", false);
    }
  }
};

const setChoice = () => {
  if (!activeQuestion.value) return;

  const result: IPostAttemp = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;

  ExamService.PostExmas(`/${activeQuestion.value.attemptId}`, result)
    .then((res) => {
      activeQuestion.value.isCorrect = res.data.isCorrect;
      activeQuestion.value.correctChoiceId = res.data.correctChoiceId;
    })
    .catch((e) => {
      notify({
        text: e.response.data.message,
        type: "error",
      });
    })
    .finally(() => {
      saveLoading.value = false;
    });
};

const handleAnswerClick = (answerId: number) => {
  if (view.value) return;

  if (activeQuestion.value?.canChange) {
    activeQuestion.value.choiceId = answerId;
    activeQuestion.value.canChange = false;
    setChoice();
  }
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
  checkImageCache();
  isDescriptionVisible.value = false;
};

// Keyboard shortcuts for F1-F12, Arrow keys, and Enter
const handleKeyPress = (event: KeyboardEvent) => {
  if (!activeQuestion.value) return;

  // Arrow Right - go to next question if answer is selected
  if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
    if (activeQuestion.value.choiceId && activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
    }
    return;
  }

  // Arrow Left - go to previous question
  if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
    if (activeQuestionIndex.value > 0) {
      event.preventDefault();
      activeQuestionIndex.value--;
      checkImageCache();
      isDescriptionVisible.value = false;
    }
    return;
  }

  // Enter key - go to next question if answer is selected
  if (event.code === 'Enter' || event.key === 'Enter') {
    if (activeQuestion.value.choiceId && activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
    }
    return;
  }

  // F1-F12 keys - only work if question can be changed
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

  // Number keys 1-9 for selecting answers
  if (event.code.match(/^Digit[1-9]$/) || event.key.match(/^[1-9]$/)) {
    event.preventDefault();
    const keyNumber = parseInt(event.key);
    const choiceIndex = keyNumber - 1;

    if (choices[choiceIndex]) {
      handleAnswerClick(choices[choiceIndex].id);
    }
  }
};

refreshTimer();
fetchAttemp();

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
  clearTimer();
});
</script>

<template>
  <div class="modern-complete-test-container">
    <!-- Header with question number, progress and timer -->
    <div class="test-header">
      <div class="question-progress">
        <span class="current-question">Savol {{ activeQuestionIndex + 1 }}</span>
        <span class="total-questions">/ 50</span>
      </div>
      <div class="progress-indicator">
        <div class="progress-bar" :style="{ width: `${((activeQuestionIndex + 1) / 50) * 100}%` }"></div>
      </div>
      <div class="time-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ secondsToHms(timer) }}</span>
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
        Ortga
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
        @click="nextAttemp()"
        :disabled="!activeQuestion?.choiceId"
        :class="{ 'disabled': !activeQuestion?.choiceId }"
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
.modern-complete-test-container {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  background: linear-gradient(90deg, #5D87FF 0%, #4A7FCC 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #EF4444;
  background: #FEF2F2;
  padding: 8px 16px;
  border-radius: 8px;

  svg {
    color: #EF4444;
  }
}

.test-content {
  flex: 1;
  padding: 32px;
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

.test-footer {
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

    &:hover:not(:disabled) {
      box-shadow: 0 6px 16px rgba(93, 135, 255, 0.4);
      transform: translateY(-1px);
    }

    &:disabled,
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #E5E7EB;
      color: #9CA3AF;
      box-shadow: none;
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

// Tablet styles
@media (max-width: 1024px) {
  .test-layout {
    grid-template-columns: 1fr;
  }

  .test-header {
    flex-wrap: wrap;
    padding: 16px 20px;
  }

  .test-content {
    padding: 20px;
  }

  .test-footer {
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

  .current-question {
    font-size: 16px;
  }

  .total-questions {
    font-size: 13px;
  }

  .time-info {
    font-size: 14px;
    justify-content: center;
    padding: 6px 12px;
  }

  .progress-indicator {
    order: 3;
    width: 100%;
  }

  .test-content {
    padding: 12px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .test-layout {
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

  .test-footer {
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
  .test-header {
    padding: 10px 12px;
  }

  .current-question {
    font-size: 15px;
  }

  .test-content {
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
  .test-header {
    padding: 8px 16px;
  }

  .test-content {
    padding: 12px 16px;
  }

  .test-layout {
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

  .test-footer {
    padding: 8px 16px;
  }
}
</style>
