<script setup>
import Icon from "../Icon.vue";

const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <v-list-item
    :to="item.type === 'external' ? '' : item.to"
    :href="item.type === 'external' ? item.to : ''"
    rounded
    class="nav-item mb-1"
    :disabled="item.disabled"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <template v-slot:prepend>
      <Icon :item="item.icon" :level="level" />
    </template>
    <v-list-item-title class="nav-title">
      {{ $t(item.title) }} <v-tooltip activator="parent" location="top">{{ $t(item.title) }} </v-tooltip>
    </v-list-item-title>
    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <template v-slot:append v-if="item.chip">
      <v-chip
        :color="item.chipColor"
        :class="'sidebarchip hide-menu bg-' + item.chipBgColor"
        :size="item.chipIcon ? 'small' : 'small'"
        :variant="item.chipVariant"
        :prepend-icon="item.chipIcon"
      >
        {{ item.chip }}
      </v-chip>
    </template>
  </v-list-item>
</template>

<style scoped lang="scss">
.nav-item {
  min-height: 44px !important;
  margin-bottom: 3px !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  align-items: center !important;
  &.v-list-item--active {
    background: #F9FAFB !important;

    .nav-title {
      color: #1F2937 !important;
      font-weight: 600 !important;
    }

    :deep(.main-icon) {
      color: #1F2937 !important;
    }

    :deep(.v-list-item__prepend) {
      margin-inline-start: 0 !important;
    }
  }

  .nav-title {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #1F2937;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 1.5;
  }

  :deep(.v-list-item__prepend) {
    margin-right: 12px !important;
    margin-inline-start: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    align-self: center !important;
    width: 20px !important;
  }

  :deep(.v-list-item__content) {
    display: flex !important;
    align-items: center !important;
    padding: 0 !important;
  }

  :deep(.v-list-item__overlay) {
    display: none !important;
  }
}
</style>
