<script setup lang="ts">
import { computed } from "vue";

interface IProps {
  width?: number | string;
  color?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  color: "var(--primary)",
  width: "32",
});

const normalizedWidth = computed(() => (1 / 16) * Number(props.width));
const normalizedBorderWidth = computed(
  () => (1 / 16) * (Number(props.width) / 100) * 10
);
</script>

<template>
  <span
    class="loader"
    :style="`--color: ${color}; --width: ${normalizedWidth}rem; --border: ${normalizedBorderWidth}rem;`"
  ></span>
</template>

<style lang="scss" scoped>
.loader {
  width: var(--width);
  height: var(--width);
  border: var(--border) solid var(--secondary-grey);
  border-bottom-color: var(--color);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
