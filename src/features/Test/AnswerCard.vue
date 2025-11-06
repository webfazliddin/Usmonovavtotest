<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import {
  ICategoryAttempData,
  ICategoryAttempDataQuestionChoice,
} from "./types";
import { toRefs } from "vue";

interface IProps {
  item: ICategoryAttempDataQuestionChoice;
  question: ICategoryAttempData;
  index: number;
  active?: boolean;
  disabled?: boolean;
}
const props = defineProps<IProps>();
const { item, question } = toRefs(props);

const alphabet = [
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
];
</script>

<template>
  <div
    :class="[
      'modern-answer-card',
      {
        active: active && question.isCorrect === null,
        success:
          question.isCorrect !== null &&
          (question.correctChoiceId === item.id ||
           (question.choiceId === item.id && question.isCorrect === true)),
        error:
          question.isCorrect !== null &&
          question.choiceId === item.id &&
          question.isCorrect === false,
      },
    ]"
    :style="{
      cursor: disabled ? 'not-allowed' : 'pointer',
    }"
  >
    <div class="answer-badge">
      {{ alphabet[index] }}
    </div>
    <span class="answer-text">{{ item.choiceText }}</span>
  </div>
</template>

<style lang="scss" scoped>
.modern-answer-card {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border: 2px solid #E8ECF4;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #5D87FF;
    box-shadow: 0 4px 12px rgba(93, 135, 255, 0.15);
    transform: translateY(-2px);
  }

  &.active {
    background: #5D87FF;
    border-color: #5D87FF;

    .answer-badge {
      background: white;
      color: #5D87FF;
    }

    .answer-text {
      color: white;
    }
  }

  &.success {
    background: #10B981;
    border-color: #10B981;

    .answer-badge {
      background: white;
      color: #10B981;
    }

    .answer-text {
      color: white;
    }
  }

  &.error {
    background: #EF4444;
    border-color: #EF4444;

    .answer-badge {
      background: white;
      color: #EF4444;
    }

    .answer-text {
      color: white;
    }
  }
}

.answer-badge {
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F0F4F8;
  color: #1F2937;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.answer-text {
  font-size: 16px;
  font-weight: 500;
  color: #1F2937;
  line-height: 1.5;
  flex: 1;
  transition: all 0.3s ease;
}

// Tablet styles
@media screen and (max-width: 1024px) {
  .modern-answer-card {
    padding: 14px 18px;
    gap: 14px;
    margin-bottom: 10px;
  }

  .answer-badge {
    min-width: 44px;
    height: 44px;
    font-size: 13px;
  }

  .answer-text {
    font-size: 15px;
  }
}

// Mobile styles
@media screen and (max-width: 768px) {
  .modern-answer-card {
    padding: 12px 14px;
    gap: 12px;
    margin-bottom: 8px;
    border-radius: 10px;
    border-width: 1.5px;

    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(93, 135, 255, 0.12);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .answer-badge {
    min-width: 40px;
    height: 40px;
    font-size: 12px;
    border-radius: 8px;
  }

  .answer-text {
    font-size: 14px;
    line-height: 1.4;
  }
}

// Small mobile (iPhone SE, small Android phones)
@media screen and (max-width: 375px) {
  .modern-answer-card {
    padding: 10px 12px;
    gap: 10px;
    margin-bottom: 8px;
  }

  .answer-badge {
    min-width: 36px;
    height: 36px;
    font-size: 11px;
  }

  .answer-text {
    font-size: 13px;
  }
}

// Touch devices optimization
@media (hover: none) and (pointer: coarse) {
  .modern-answer-card {
    -webkit-tap-highlight-color: rgba(93, 135, 255, 0.1);
    touch-action: manipulation;

    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
  }
}
</style>
