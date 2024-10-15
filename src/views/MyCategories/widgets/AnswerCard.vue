<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import {
  ICategoryAttempData,
  ICategoryAttempDataQuestionChoice,
} from "../types";
import { computed, toRefs } from "vue";

interface IProps {
  item: ICategoryAttempDataQuestionChoice;
  activeQuestion: ICategoryAttempData;
  index: number;
  active?: boolean;
  isCorrect?: boolean;
}
const props = defineProps<IProps>();
const { activeQuestion, item } = toRefs(props);
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

const isCorrect = computed(() => {
  if (
    activeQuestion.value.choiceId === item.value.id &&
    activeQuestion.value.isCorrect
  ) {
    return "success";
  }

  if (
    activeQuestion.value.choiceId === item.value.id &&
    typeof activeQuestion.value.isCorrect !== "undefined" &&
    activeQuestion.value.isCorrect == false
  ) {
    return "error";
  }

  return "";
});
</script>

<template>
  <UiParentCard
    elevation="0"
    :class="[
      'test-card px-2 py-2',

      isCorrect,
      {
        active: active,
      },
    ]"
  >
    <VIcon
      :bg="active ? 'var(--light)' : 'var(--oquv-kurslari-info-text-color)'"
    >
      <div class="num font-weight-bold mr-4">
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
  }

  &.success {
    background-color: rgb(var(--v-theme-success)) !important;
  }
}
</style>
