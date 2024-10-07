<script setup lang="ts">
import { ref } from "vue";
import { MyCategories } from "./types";
import { MyCategoriesService } from "@/services/services/MyCategories";
import UiParentCard from "@/components/UiParentCard.vue";

const myCategories = ref<MyCategories[]>([]);
const loading = ref(false);
const getMyCategories = () => {
  MyCategoriesService.MyCategories().then((res) => {
    myCategories.value = res.data.categories;
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
          <v-expansion-panel-text> </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </UiParentCard>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: flex-start;
}
</style>
