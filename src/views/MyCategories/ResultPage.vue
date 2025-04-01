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
    <ResultTest :attemp-id="attempId" @goTests="goTestsButton" />
  </div>
</template>

<style lang="scss" scoped></style>
