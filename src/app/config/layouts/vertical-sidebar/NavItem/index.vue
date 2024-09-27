<script setup>
import Icon from "../Icon.vue";

const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <v-list-item
    :to="item.type === 'external' ? '' : item.to"
    :href="item.type === 'external' ? item.to : ''"
    rounded
    class="mb-1"
    :disabled="item.disabled"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <template v-slot:prepend>
      <Icon :item="item.icon" :level="level" />
    </template>
    <v-list-item-title>
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
