<script setup lang="ts">
import { DotsIcon } from "vue-tabler-icons";

interface IProps {
  item: any;
}
const props = defineProps<IProps>();
</script>

<template>
  <v-list-subheader
    class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-semibold d-flex align-items-center"
    v-if="props.item?.header"
  >
    <span class="mini-icon"
      ><DotsIcon size="16" stroke-width="1.5" class="iconClass"
    /></span>
    <span class="mini-text">{{ props.item.header }}</span>
  </v-list-subheader>
</template>
