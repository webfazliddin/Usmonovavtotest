<script setup lang="ts">
interface IProps {
  item: any;
}
const props = defineProps<IProps>();
</script>

<template>
  <div
    class="nav-group-header"
    v-if="props.item?.header"
  >
    <div class="group-line" />
    <span class="group-text">{{ $t(props.item.header) }}</span>
    <div class="group-line" />
  </div>
</template>

<style scoped lang="scss">
.nav-group-header {
  display: flex;
  align-items: center;
  padding: 18px 14px 10px !important;
  gap: 10px;

  .group-line {
    flex: 1;
    height: 1px;
    background: transparent;
  }

  .group-text {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    white-space: nowrap;
  }
}
</style>
