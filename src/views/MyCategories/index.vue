<script setup lang="ts">
import { ref } from "vue";
import { MyCategories } from "./types";
import { MyCategoriesService } from "@/services/services/MyCategories";
import UiParentCard from "@/components/UiParentCard.vue";
import VMyCategory from "@/components/VMyCategory.vue";
import { AxiosResponse } from "axios";
import TestProcess from "./widgets/TestProcess.vue";

const myCategories = ref<MyCategories[]>([]);
const loading = ref(false);
const isDialog = ref<boolean>(false);
const selectedCategory = ref<MyCategories | null>({
  answeredCount: 0,
  attemptId: 14,
  correctAnswerCount: 0,
  id: 1,
  name: "Tibbiyot",
  questionsCount: 3,
  description: "",
});

const getMyCategories = () => {
  MyCategoriesService.MyCategories().then(
    (
      res: AxiosResponse<{
        categories: MyCategories[];
      }>
    ) => {
      myCategories.value = res.data.categories.sort((a, b) => {
        if (a.attemptId) {
          return 1;
        }
        if (!a.attemptId) {
          return -1;
        }
        return 0;
      });
    }
  );
};

getMyCategories();
</script>
<template>
  <div>
    <UiParentCard v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <UiParentCard v-if="!loading && myCategories.length">
      <v-expansion-panels>
        <v-expansion-panel class="mt-4" v-for="item in myCategories">
          <v-expansion-panel-title>
            {{ item.name }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VMyCategory
              :item="item"
              @start="
                () => {
                  isDialog = true;
                  selectedCategory = item;
                }
              "
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </UiParentCard>

    <v-dialog v-if="isDialog" v-model:model-value="isDialog" fullscreen>
      <TestProcess
        v-if="selectedCategory"
        :category="selectedCategory"
        :count="10"
      />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: flex-start;
}
</style>
