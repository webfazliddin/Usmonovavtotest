<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuestions } from "./store/useQuestions";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";

const store = useQuestions();
const { questions, questionsLoading } = storeToRefs(store);

const router = useRouter();

const fetchQuestion = (id: string | number) => {
  router.push({
    name: "EditQuestion",
    params: {
      id,
    },
  });
};


store.fetchQuestions()
</script>

<template>
  <div>
    <Banner :text="$t('signInBannerDescription')">
      <template #icon>
        <img class="banner-icon" src="@/assets/images/learn.png" alt="" />
      </template>
    </Banner>
    <v-row>
      <v-col md="6" cols="12">
        <h1>{{ $t("testPage") }}</h1>
      </v-col>
      <v-col md="6" cols="12" class="text-lg-right">
        <v-btn color="info" @click="fetchQuestion(0)">
          {{ $t("createTest") }}
        </v-btn>
      </v-col>
    </v-row>
    <UiParentCard class="mt-4" v-if="!questionsLoading && !questions.length">
      <p class="font-weight-bold text-subtitle-1 text-center">
        {{ $t("notFound") }}
      </p>
    </UiParentCard>
    <UiParentCard class="text-center" v-if="questionsLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-expansion-panels v-if="questions?.length && !questionsLoading">
      <v-expansion-panel class="my-2" v-for="item in questions">
        <v-expansion-panel-title>
          {{ item?.questionText }}
        </v-expansion-panel-title>
        <v-expansion-panel-text> </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style lang="scss" scoped>
.banner-icon {
  width: 2.75rem;
  height: 2.75rem;
}
</style>
