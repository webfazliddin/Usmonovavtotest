<script setup lang="ts">
import { DotsIcon } from "vue-tabler-icons";

interface IProps {
  item: any;
}
const props = defineProps<IProps>();
</script>

<template>
  <v-list-subheader
    class="nav-group-header"
    v-if="props.item?.header"
  >
    <span class="mini-icon">
      <DotsIcon size="14" stroke-width="2" class="icon-dots" />
    </span>
    <span class="group-text">{{ props.item.header }}</span>
  </v-list-subheader>
</template>

<style scoped lang="scss">
.nav-group-header {
  display: flex;
  align-items: center;
  padding: 16px 12px 8px 12px !important;
  min-height: auto !important;
  height: auto !important;
  margin-top: 4px;

  .mini-icon {
    display: flex;
    align-items: center;
    margin-right: 8px;

    .icon-dots {
      color: #9ca3af;
    }
  }

  .group-text {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}
</style>
