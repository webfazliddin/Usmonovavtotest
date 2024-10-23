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
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
</script>

<template>
  <UiParentCard
    elevation="0"
    :class="[
      'test-card px-2 py-2',

      {
        active: active,
        success: question.correctChoiceId === item.id,
        error:
          question.isCorrect !== null &&
          question.choiceId === item.id &&
          question.isCorrect == false,
      },
    ]"
    :style="{
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }"
  >
    <VIcon
      :bg="active ? 'var(--light)' : 'var(--oquv-kurslari-info-text-color)'"
    >
      <div class="num font-weight-bold mr-8">
        {{ alphabet[index] }}
      </div>
    </VIcon>
    <span>{{ item.choiceText }}</span>
  </UiParentCard>
</template>

<style lang="scss" scoped>
.test-card {
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  gap: 0.75rem;
  transition: all 0.4s;
  border: 1px solid rgba(83, 83, 83,0.1);
margin-bottom: 0.5rem;

  &.active {
    background: rgb(var(--v-theme-primary)) !important;
    .num {
      color: rgb(var(--v-theme-light));
    }
    span {
      color: rgb(var(--v-theme-light));
    }
  }
  &.error {
    background-color: rgb(var(--v-theme-error)) !important;
    .num {
      color: rgb(var(--v-theme-light));
    }
    span {
      color: rgb(var(--v-theme-light));
    }
  }

  &.success {
    background-color: rgb(var(--v-theme-success)) !important;
    .num {
      color: rgb(var(--v-theme-light));
    }
    span {
      color: rgb(var(--v-theme-light));
    }
  }
}
</style>
