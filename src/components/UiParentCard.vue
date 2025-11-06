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
  border: 1px solid #E8ECF4;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
  padding: 24px;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(74, 144, 226, 0.12);
    transform: translateY(-2px);
    border-color: rgba(74, 144, 226, 0.3);
  }

  &--no-padding {
    padding: 0;
  }

  &--flat {
    box-shadow: none;

    &:hover {
      box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
    }
  }

  &--elevated {
    box-shadow: 0 8px 24px rgba(74, 144, 226, 0.16);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
