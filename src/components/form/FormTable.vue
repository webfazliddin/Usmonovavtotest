<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { ITable } from "@/models/vuetify/types";
import { computed } from "vue";
import { ArrowDownIcon, ArrowUpIcon } from "vue-tabler-icons";
import UiParentCard from "../UiParentCard.vue";

const props = withDefaults(defineProps<ITable>(), {
  tableHeight: "540",
  density: "compact",
  fixedHeader: true,
  identifier: true,
});

const emits = defineEmits(["refresh", "rowClick"]);
const { parseNumber, getColor } = useGlobal();

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
  <div>
    <UiParentCard class="border" elevation="0">
      <v-table
        class="month-table"
        :height="tableHeight"
        :density="density"
        :fixed-header="fixedHeader"
        :fixed-footer="fixedFooter"
        :class="tableClass"
        :hover="hover"
        :ref="tableRef"
      >
        <thead class="text-center">
          <tr>
            <th class="font-weight-bold text-center" v-if="prependAction">
              <v-label>{{ $t("actions") }}</v-label>
            </th>
            <template v-for="(field, index) in fields">
              <slot :name="`header-${field.key}`" :index="index" :field="field">
                <th class="font-weight-bold pa-0" :class="field.thClass">
                  <div class="d-flex align-center cursor-pointer mx-2">
                    <v-label>
                      {{ $t(field.label) }}
                    </v-label>
                    <ArrowDownIcon
                      size="20"
                      v-if="
                        filter &&
                        filter.sortBy == field.key &&
                        filter.orderType == 'desc' &&
                        field.sort
                      "
                    />
                    <ArrowUpIcon
                      size="20"
                      v-if="
                        filter &&
                        filter.sortBy == field.key &&
                        filter.orderType == 'asc' &&
                        field.sort
                      "
                    />
                  </div>
                </th>
              </slot>
            </template>
            <th class="font-weight-bold text-center" v-if="appendAction">
              <v-label>{{ $t("actions") }}</v-label>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td class="px-0" :colspan="fields.length + 1">
              <div>
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
              </div>
            </td>
          </tr>

          <tr
            v-if="
              (!loading && items && items.length == 0) || (!loading && !items)
            "
          >
            <td
              :class="[`font-weight-bold h5 text-center bg-light`]"
              :colspan="fields.length + 1"
            >
              <div>
                {{ $t("notFound") }}
              </div>
            </td>
          </tr>
          <template v-if="!loading && items">
            <tr
              v-for="(item, index) in items"
              :key="index"
              @click="emits('rowClick', item)"
            >
              <!-- ACTIONS -->
              <td v-if="prependAction">
                <slot name="prepend-action" :item="item" :fields="fields">
                </slot>
              </td>
              <template v-for="(field, fieldIndex) in fields">
                <slot
                  :name="field.key"
                  :item="item"
                  :index="index"
                  :field="field"
                >
                  <td :key="fieldIndex" :class="[field.tdClass]">
                    <template
                      v-if="
                        field.key != 'status' &&
                        field.key != 'prtnContractStatus' &&
                        field.key != 'state'
                      "
                    >
                      {{
                        field.isAmount
                          ? parseNumber(item[field.key])
                          : item[field.key]
                      }}
                    </template>
                    <v-chip
                      class="font-weight-bold px-2 mr-2"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'status'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip
                      class="font-weight-bold px-2 mr-2"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'prtnContractStatus'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip
                      class="font-weight-bold px-2 mr-2"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'state'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                  </td>
                </slot>
              </template>
              <!-- ACTIONS -->
              <td v-if="appendAction" class="text-center" >
                <slot name="actions" :item="item"> </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </UiParentCard>
    <slot
      name="pagination"
      :lastNumber="lastNumber"
      :firstNumber="firstNumber"
      :filter="filter"
    >
      <v-row class="mt-1" v-if="props.filter">
        <v-col cols="12" lg="6" class="d-flex" style="align-items: center">
          <div class="mr-2">
            <v-select
              density="compact"
              class="mt-4"
              v-model="filter.page"
              :items="[20, 50, 100, 200, 500]"
              variant="solo-filled"
            />
          </div>
          <div>
            <v-label class="text-grey200">
              {{
                $t("RecordsFrom", {
                  current: firstNumber,
                  size: lastNumber,
                  count: filter.total,
                })
              }}
            </v-label>
          </div>
        </v-col>
        <v-col cols="12" lg="6" class="text-right">
          <v-pagination
            rounded="circle"
            class="my-custom-pagination"
            v-model="filter.page"
            :length="Math.ceil(filter.total / filter.size)"
            :total-visible="4"
          ></v-pagination>
        </v-col>
      </v-row>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
  outline: none;
  background: transparent;
}
</style>
