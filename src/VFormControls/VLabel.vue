<script setup lang="ts">
interface IProps {
  text?: string;
}
defineProps<IProps>();
</script>

<template>
  <label class="label " v-bind="$attrs">
    {{ text }}
    <slot></slot>
  </label>
</template>

<style lang="scss" scoped>
.label {
  display: flex;
  align-items: center;
  color: #9497a1;
}
</style>
