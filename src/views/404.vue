<script setup lang="ts">
import { useRouter } from "vue-router";
import VButton from "@/components/VButton.vue";
const router = useRouter();
</script>

<template>
  <div class="container">
    <img src="@/assets/notfound.svg" alt="404 error" class="image" />
    <img src="@/assets/404.svg" alt="404 error" class="image" />
    <VButton
      @click="router.back"
      size="md"
      :text="$t('not_found_page')"
      class="button"
      >{{ $t("not_found_page") }}</VButton
    >
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100% !important;
  max-width: 100%;
  background-color: #ebf8ff; /* bg-blue-50 */
}

.image {
  width: 33.3333%; /* w-1/3 */
  margin-bottom: 2rem; /* mb-8 */
}

.button {
  font-size: 1.5rem; /* text-2xl */
  color: #4b5563; /* text-gray-600 */
}
</style>
