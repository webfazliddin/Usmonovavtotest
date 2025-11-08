<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from "vue";
import { ICategoryAttempData } from "./types";
import AnswerCard from "./AnswerCard.vue";
import { CardService } from "@/services/services/Cards.service";
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

const activeQuestion = computed(
  () => attempt.value && attempt.value[activeQuestionIndex.value]
);

const fetchAttemp = () => {
  CardService.Result(attempId.value)
    .then((res) => {
      attempt.value = res.data;
    })
    .catch((e) => {
      setError(e);
    });
};

const nextAttemp = () => {
  if (activeQuestionIndex.value === attempt.value.length - 1) return;
  activeQuestionIndex.value = activeQuestionIndex.value + 1;
  isDescriptionVisible.value = false;
};

const prevAttemp = () => {
  if (activeQuestionIndex.value === 0) return;
  activeQuestionIndex.value = activeQuestionIndex.value - 1;
  isDescriptionVisible.value = false;
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
  isDescriptionVisible.value = false;
};

// Keyboard shortcuts
const handleKeyPress = (event: KeyboardEvent) => {
  if (!activeQuestion.value) return;

  // Arrow Right - go to next question
  if (event.code === 'ArrowRight' || event.key === 'ArrowRight') {
    if (activeQuestionIndex.value !== attempt.value.length - 1) {
      event.preventDefault();
      nextAttemp();
    }
    return;
  }

  // Arrow Left - go to previous question
  if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft') {
    if (activeQuestionIndex.value > 0) {
      event.preventDefault();
      prevAttemp();
    }
    return;
  }

  // Enter key - go to next question
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
  <div class="modern-test-container">
    <!-- Header with question number and progress -->
    <div class="test-header">
      <div class="question-progress">
        <span class="current-question">Savol {{ activeQuestionIndex + 1 }}</span>
        <span class="total-questions">/ {{ attempt.length }}</span>
      </div>
      <div class="progress-indicator">
        <div class="progress-bar" :style="{ width: `${((activeQuestionIndex + 1) / attempt.length) * 100}%` }"></div>
      </div>
      <div class="time-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ Math.round(((attempt.filter(q => q.isCorrect).length) / attempt.length) * 100) }}% to'g'ri</span>
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
              ← →: Oldinga/Orqaga | Enter: Keyingi
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
            <img
              :src="activeQuestion?.question?.fileId ? `https://api.uatest.uz/api/Files?fileName=${activeQuestion.question.fileId}` : defaultImage"
              class="test-image"
              :alt="`Savol ${activeQuestionIndex + 1} rasmi`"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom navigation with navigator -->
    <div class="test-footer">
      <button class="footer-btn back-btn" @click="emits('goTests')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Mavzularga qaytish</span>
      </button>

      <!-- Question Navigator inside footer -->
      <div class="question-navigator" v-if="attempt.length">
        <div
          v-for="(n, i) in attempt"
          :key="i"
          class="nav-number"
          :class="{
            'active': i === activeQuestionIndex,
            'correct': n.isCorrect,
            'incorrect': n.choiceId && !n.isCorrect
          }"
          @click="setActiveQuestionIndex(i)"
        >
          {{ i + 1 }}
        </div>
      </div>

      <button
        class="footer-btn prev-btn"
        @click="prevAttemp()"
        v-if="activeQuestionIndex > 0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Oldingi</span>
      </button>

      <button
        class="footer-btn next-btn"
        @click="nextAttemp()"
        v-if="activeQuestionIndex !== attempt.length - 1"
      >
        <span>Keyingi</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Copy all styles from CardTest.vue
.modern-test-container {
  font-family: 'Poppins', sans-serif;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #F8FAFB;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
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
  font-size: 14px;
  font-weight: 600;
  color: #10B981;

  svg {
    color: #10B981;
  }
}

.test-content {
  flex: 1;
  padding: 32px;
  padding-bottom: 80px;
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
}

.test-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  max-height: 600px;
  min-height: 300px;
}

.question-navigator {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 12px;
  scroll-behavior: smooth;
  max-width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.test-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px 32px;
  border-top: 1px solid #E8ECF4;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  z-index: 101;
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

  &.prev-btn {
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
    padding-bottom: 90px;
  }

  .test-footer {
    padding: 16px 20px;
  }

  .question-navigator {
    padding: 0 8px;
    gap: 6px;
  }
}

@media (max-width: 768px) {
  .test-header {
    padding: 10px 12px;
    gap: 8px;
    flex-direction: column;
    align-items: stretch;
  }

  .question-progress {
    width: 100%;
    justify-content: space-between;
  }

  .current-question {
    font-size: 15px;
  }

  .total-questions {
    font-size: 12px;
  }

  .time-info {
    font-size: 12px;
    justify-content: center;
  }

  .progress-indicator {
    order: 3;
    width: 100%;
    height: 6px;
  }

  .test-content {
    padding: 8px;
    padding-bottom: 85px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .test-layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .question-card {
    padding: 12px;
    border-radius: 10px;
  }

  .question-number-badge {
    font-size: 10px;
    padding: 4px 8px;
    margin-bottom: 8px;
  }

  .question-title {
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .keyboard-hint {
    display: none; // Hide keyboard hints on mobile
  }

  .answers-list {
    gap: 10px;
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

  .test-footer {
    padding: 10px 12px;
    gap: 6px;
    flex-wrap: nowrap;
  }

  .question-navigator {
    padding: 0 4px;
    gap: 5px;

    // Better scrolling on mobile
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Hide scrollbar on mobile
    }
  }

  .footer-btn {
    padding: 10px;
    font-size: 12px;
    border-radius: 8px;
    white-space: nowrap;
    min-width: auto;

    svg {
      width: 16px;
      height: 16px;
    }

    // Show only icons on mobile for back and prev buttons
    &.back-btn,
    &.prev-btn {
      span {
        display: none;
      }
    }

    &.next-btn {
      min-width: 80px;

      span {
        font-size: 11px;
      }
    }
  }

  .nav-number {
    min-width: 38px;
    height: 38px;
    font-size: 13px;
    border-radius: 8px;
    border-width: 2px;

    // Better touch target
    touch-action: manipulation;
  }
}
</style>
