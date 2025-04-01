<script setup lang="ts">
import { MyCategories } from "@/views/MyCategories/types";
import { toRefs } from "vue";
import {
  FileDescriptionIcon,
  PercentageIcon,
  UserCheckIcon,
} from "vue-tabler-icons";

interface IProps {
  item?: MyCategories;
  canContiniue?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  canContiniue: true,
});

const { item } = toRefs(props);
const emits = defineEmits(["start", "continue"]);
</script>

<template>
  <div class="bg-info pa-3 rounded">
    <div class="category-header d-flex justify-content-between flex-wrap">
      <div v-if="item">
        <div
          class="item"
          v-if="item.progressPercentage"
          :style="{ color: item.progressPercentage >= 80 ? 'green' : 'white' }"
        >
          <div class="icon">
            <PercentageIcon color="black" />
          </div>
          <span>
            {{
              $t("progress", { count: Math.round(item.progressPercentage) })
            }}
            -
            {{
              item.progressPercentage >= 80
                ? $t("goodJob")
                : $t("needsImprovement")
            }}
          </span>
        </div>
      </div>

      <div class="item" v-if="item?.questionsCount">
        <div class="icon">
          <FileDescriptionIcon color="black" />
        </div>
        <span> {{ $t("testCount", { count: item?.questionsCount }) }} </span>
      </div>

      <div class="item" v-if="item?.answeredCount">
        <div class="icon">
          <UserCheckIcon color="black" />
        </div>

        <span>
          {{ $t("answeredCount", { count: item?.answeredCount }) }}
        </span>
      </div>
      <div class="item" v-if="item?.correctAnswerCount">
        <div style="color: black; font-size: 25px" class="icon">✔</div>

        <span>
          {{ $t("correctAnswerCount", { count: item.correctAnswerCount }) }}
        </span>
      </div>
    </div>

    <div class="category-body mt-4 mx-2">
      <li v-if="item?.description">
        {{ item.description }}
      </li>
      <v-btn class="mt-4" color="light" @click="emits('start', item)">
        {{ $t("startTest") }}
      </v-btn>
      <v-btn
        v-if="canContiniue"
        class="mt-4 ml-10"
        style="background-color: #ffab00"
        @click="emits('continue', item)"
      >
        {{ $t("continueTest") }}
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
