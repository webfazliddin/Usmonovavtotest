<script setup lang="ts">
import { ref } from "vue";
import { MyCategories } from "./types";
import { MyCategoriesService } from "@/services/services/MyCategories";
import UiParentCard from "@/components/UiParentCard.vue";
import VMyCategory from "@/components/VMyCategory.vue";
import { AxiosResponse } from "axios";
import TestProcess from "@/features/Test/TestProcess.vue";
import CompleteTest from "@/features/Test/CompleteTest.vue";

const myCategories = ref<MyCategories[]>([]);
const loading = ref(false);
const isDialog = ref<boolean>(false);
const isCompleteTest = ref<boolean>(false);
const continueTest = ref<boolean>(false);
const selectedCategory = ref<MyCategories | null>(null);

const getMyCategories = () => {
  myCategories.value = [];
  loading.value = true;
  MyCategoriesService.MyCategories()
    .then(
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
    )
    .finally(() => {
      loading.value = false;
    });
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
              @continue="
                () => {
                  isDialog = true;
                  selectedCategory = item;
                  continueTest = true;
                }
              "
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel class="mt-4">
          <v-expansion-panel-title>
            {{ $t("finalTest") }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <VMyCategory
              :item="{
                name: $t('finalTest'),
                questionsCount: 0,
                answeredCount: 0,
                correctAnswerCount: 0,
                attemptId: null,
                description: '',
                id: 0,
              }"
              @start="
                () => {
                  isCompleteTest = true;
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
        v-model:model-value="isDialog"
        @update:model-value="
          (val) => {
            isDialog = val;
            continueTest = false;
          }
        "
        :continueTest="continueTest"
      />
    </v-dialog>

    <v-dialog
      v-if="isCompleteTest"
      v-model:model-value="isCompleteTest"
      fullscreen
    >
      <CompleteTest v-model:model-value="isCompleteTest" />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: flex-start;
}
</style>
