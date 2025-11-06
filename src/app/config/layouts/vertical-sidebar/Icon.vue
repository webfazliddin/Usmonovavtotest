<script setup>
const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <template v-if="level > 0">
    <component
      :is="item"
      size="14"
      stroke-width="1.5"
      class="iconClass sub-icon"
    ></component>
  </template>
  <template v-else>
    <component
      :is="item"
      size="21"
      stroke-width="1.5"
      class="iconClass main-icon"
    ></component>
  </template>
</template>

<style scoped lang="scss">
.iconClass {
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon {
  color: #6b7280;
  stroke-width: 1.5;
}

.sub-icon {
  color: #9ca3af;
  stroke-width: 1.5;
}
</style>
