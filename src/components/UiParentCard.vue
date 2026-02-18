<script setup lang="ts">
interface IProps {
  noPadding?: boolean;
  variant?: 'default' | 'flat' | 'elevated';
}

const props = withDefaults(defineProps<IProps>(), {
  noPadding: false,
  variant: 'default'
});
</script>

<template>
  <div
    class="modern-card"
    :class="{
      'modern-card--no-padding': noPadding,
      'modern-card--flat': variant === 'flat',
      'modern-card--elevated': variant === 'elevated'
    }"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.modern-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease;

  &--no-padding {
    padding: 0;
  }

  &--flat {
    background: #f9fafb;
  }

  &--elevated {
    background: #FFFFFF;
  }
}

@media (max-width: 768px) {
  .modern-card {
    padding: 16px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .modern-card {
    padding: 12px;
    border-radius: 10px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
