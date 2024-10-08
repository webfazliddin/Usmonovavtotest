<script setup lang="ts">
interface IProps {
  tag?: string;
  label: string;
  icon?: any;
  img?: any;
}
withDefaults(defineProps<IProps>(), {
  tag: "button",
});
</script>

<template>
  <component class="nav-item" :is="tag">
    <div class="icon" v-if="img">
      <slot name="image">
        <img :src="img" />
      </slot>
    </div>
    <div class="icon" v-if="icon">
      <slot name="icon">
        <component :is="icon"></component>
      </slot>
    </div>
    {{ label }}
  </component>
</template>

<style lang="scss" scoped>
.nav-item {
  padding: 0.625rem 0.75rem;
  background: var(--bar-card-bg-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 500;
  line-height: 1.5rem;
  cursor: pointer;
  transition: all 0.4s;
  outline: none;
  width: 100%;
  border-color: transparent;
  color: #fff;
  border: 1px solid transparent;
  overflow: hidden;

  white-space: nowrap;

  .icon {
    width: 1.75rem;
    flex: 0 0 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep() svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }

  &.router-link-exact-active {
    border-color: var(--success);
    background-color: var(--bar-card-active-bg-color);
  }
}
</style>
