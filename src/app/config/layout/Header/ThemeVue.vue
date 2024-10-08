<script setup lang="ts">
import VIcon from "@/components/VIcon.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { SunIcon } from "vue-tabler-icons";
const globalStore = useGlobalStore();
</script>

<template>
  <div class="theme">
    <VIcon
      :icon="SunIcon"
      color="var(--secondary-light)"
      bg="var(--default-bg)"
      @click="globalStore.handleTheme('primary')"
    />
    <VIcon
      :icon="SunIcon"
      color="var(--secondary-light)"
      bg="var(--green-bg)"
      @click="globalStore.handleTheme('green')"
    />
    <VIcon
      :icon="SunIcon"
      color="var(--secondary-light)"
      bg="var(--dark-bg)"
      @click="globalStore.handleTheme('dark')"
    />
  </div>
</template>

<style lang="scss" scoped>
.theme {
  margin-top: 0.375rem;
  display: flex;
  gap: 0.75rem;

  --default-bg: rgba(50, 113, 211, 1);
  --green-bg: rgba(20, 116, 111, 1);
  --dark-bg: rgba(0, 0, 0, 1);

  :deep() .btn-icon {
    @include media(phone) {
      width: 1.5rem;
      height: 1.5rem;
      flex: 0 0 1.5rem;
    }
  }
}
</style>
