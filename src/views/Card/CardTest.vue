<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);

const showResult = (val: number | string) => {
  loading.value = true;
  setTimeout(() => {
    router.push({ name: "ResultPage", params: { attemptId: val } });
    loading.value = false;
  }, 700);
};
</script>

<template>
  <v-card>
    <v-card-title>
      <h1>{{ $t("CardTestPage") }}</h1>
    </v-card-title>
    <v-card-text>
      <CompleteTest @show-result="showResult" />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
