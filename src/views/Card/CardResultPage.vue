<script setup lang="ts">
import CardTestResult from "@/features/Test/CardTestResult.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const attempId = +(route.params.attemptId as string);

const goTestsButton = () => {
  router.push({ name: "Card" });
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>{{ $t("testResult") }}</h1>
      </v-card-title>
      <v-card-text>
        <CardTestResult :attemp-id="attempId" @goTests="goTestsButton" />
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
