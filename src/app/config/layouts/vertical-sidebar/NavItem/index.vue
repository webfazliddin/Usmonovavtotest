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
  min-height: 42px !important;
  margin-bottom: 2px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  padding: 10px 12px !important;
  align-items: center !important;
  border: 1px solid transparent;

  &:hover {
    background: #F8F9FC !important;
    border-color: #E8ECF4;

    .nav-title {
      color: #111827 !important;
    }

    :deep(.main-icon) {
      color: #4A90E2 !important;
    }
  }

  &.v-list-item--active {
    background: #EFF6FF !important;
    border: 1px solid #BFDBFE !important;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);

    .nav-title {
      color: #4A90E2 !important;
      font-weight: 600 !important;
    }

    :deep(.main-icon) {
      color: #4A90E2 !important;
    }

    :deep(.v-list-item__prepend) {
      margin-inline-start: 0 !important;
    }
  }

  .nav-title {
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    color: #374151;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 1.5;
    transition: color 0.2s ease;
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
