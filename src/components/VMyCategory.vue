<script setup lang="ts">
import { MyCategories } from "@/views/MyCategories/types";
import { toRefs } from "vue";

interface IProps {
  item: MyCategories;
}
const props = defineProps<IProps>();

const { item } = toRefs(props);
const emits = defineEmits(["start"]);
</script>

<template>
  <div class="bg-info pa-3 rounded">
    <div class="category-header d-flex justify-content-between flex-wrap">
      <div class="item">
        <div class="icon">
          <img src="@/assets/images/testCount.png" alt="" />
        </div>

        <span> {{ $t("testCount", { count: item.questionsCount }) }} </span>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/assets/images/testIcon.png" alt="" />
        </div>

        <span>
          {{ $t("answeredCount", { count: item.answeredCount }) }}
        </span>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/assets/images/testCount.png" alt="" />
        </div>

        <span>
          {{ $t("correctAnswerCount", { count: item.correctAnswerCount }) }}
        </span>
      </div>
    </div>

    <div class="category-body mt-4">
      <li>
        {{ item.description }}
      </li>

      <v-btn class="mt-4" color="light" @click="emits('start', item)">
        {{ item.attemptId ? $t("continueTest") : $t("startTest") }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-info {
  background: linear-gradient(91.88deg, #0e449b 0%, #4284eb 100%);
  cursor: pointer;
}
.category-header {
  display: flex;
  gap: 60px;
  .item {
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      font-weight: 500;
      margin-left: 4px;
    }
  }

  li {
    list-style-type: circle;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
  .icon {
    width: 2.5625rem;
    height: 2.5625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    img {
      width: 1.5625rem;
      height: 1.5625rem;
    }

    background-color: rgb(var(--v-theme-background));
  }
}
</style>
