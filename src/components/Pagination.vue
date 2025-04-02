<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { computed } from "vue";

const props = defineProps<{
  filter: any;
}>();

const { parseNumber } = useGlobal();

const firstNumber = computed(() => {
  if (props.filter) {
    return (props.filter.page - 1) * props.filter.size + 1;
  }
  return 0;
});

const lastNumber = computed(() => {
  if (props.filter) {
    if (props.filter.total < props.filter.size) {
      return props.filter.total;
    } else {
      if (props.filter.page * props.filter.size > props.filter.total) {
        return props.filter.total;
      } else {
        return props.filter.page * props.filter.size;
      }
    }
  }
  return 0;
});
</script>
<template>
  <v-row class="mt-1">
    <v-col cols="12" lg="6" class="d-flex py-0" style="align-items: center">
      <div class="mr-2 d-flex align-center gap-2">
        <v-select
          density="compact"
          v-model="filter.size"
          @update:modelValue="
            () => {
              filter.page = 1;
              $emit('getData');
            }
          "
          :items="[20, 50, 100, 200, 500]"
          variant="solo-filled"
          hide-details
        />
        <v-label class="text-grey200">
          {{
            $t("RecordsFrom", {
              current: parseNumber(firstNumber || 0),
              pageSize: parseNumber(lastNumber || 0),
              count: parseNumber(filter.total || 0),
            })
          }}
        </v-label>
      </div>
    </v-col>
    <v-col cols="12" lg="6" class="text-right py-0">
      <v-pagination
        @click="$emit('getData')"
        class="my-custom-pagination"
        v-model="filter.page"
        :length="Math.ceil(filter.total / filter.size)"
        :total-visible="4"
        size="small"
      ></v-pagination>
    </v-col>
  </v-row>
</template>
