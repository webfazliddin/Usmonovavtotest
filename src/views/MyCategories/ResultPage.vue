<script setup lang="ts">
import ResultTest from "@/features/Test/ResultTest.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const attempId = +(route.params.attemptId as string);

const goTestsButton = () => {
  router.push({ name: "MyCategories" });
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>{{ $t("testResult") }}</h1>
      </v-card-title>
      <v-card-text>
        <ResultTest :attemp-id="attempId" @goTests="goTestsButton" />
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
