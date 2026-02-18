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
      size="20"
      stroke-width="1.5"
      class="iconClass main-icon"
    ></component>
  </template>
</template>

<style scoped lang="scss">
.iconClass {
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon {
  color: #555555;
  stroke-width: 1.5;
}

.sub-icon {
  color: #777777;
  stroke-width: 1.5;
}
</style>
