<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { ITable } from "@/models/vuetify/types";
import { computed } from "vue";
import { ArrowDownIcon, ArrowUpIcon } from "vue-tabler-icons";

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

const refresh = (props: any) => {
  emits("refresh", props);
};
</script>

<template>
  <div class="modern-table-wrapper">
    <div class="table-container">
      <v-table
        class="modern-table"
        :height="tableHeight"
        :density="density"
        :fixed-header="fixedHeader"
        :fixed-footer="fixedFooter"
        :class="tableClass"
        :hover="hover"
        :ref="tableRef"
      >
        <thead>
          <tr class="table-header-row">
            <th class="table-header-cell prepend-action" v-if="prependAction">
              <span>{{ $t("actions") }}</span>
            </th>
            <template v-for="(field, index) in fields">
              <slot :name="`header-${field.key}`" :index="index" :field="field">
                <th class="table-header-cell" :class="field.thClass">
                  <div class="header-content">
                    <span>{{ $t(field.label) }}</span>
                    <ArrowDownIcon
                      :size="18"
                      class="sort-icon"
                      v-if="
                        filter &&
                        filter.sortBy == field.key &&
                        filter.orderType == 'desc' &&
                        field.sort
                      "
                    />
                    <ArrowUpIcon
                      :size="18"
                      class="sort-icon"
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
            <th class="table-header-cell append-action" v-if="appendAction">
              <span>{{ $t("actions") }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading" class="table-loading-row">
            <td class="table-loading-cell" :colspan="fields.length + (prependAction ? 1 : 0) + (appendAction ? 1 : 0)">
              <div class="loading-wrapper">
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
              </div>
            </td>
          </tr>

          <tr
            v-if="
              (!loading && items && items.length == 0) || (!loading && !items)
            "
            class="table-empty-row"
          >
            <td
              class="table-empty-cell"
              :colspan="fields.length + (prependAction ? 1 : 0) + (appendAction ? 1 : 0)"
            >
              <div class="empty-state">
                {{ $t("notFound") }}
              </div>
            </td>
          </tr>

          <template v-if="!loading && items">
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="table-body-row"
              @click="emits('rowClick', item)"
            >
              <!-- PREPEND ACTIONS -->
              <td v-if="prependAction" class="table-body-cell prepend-action">
                <slot name="prepend-action" :item="item" :fields="fields">
                </slot>
              </td>

              <!-- DATA CELLS -->
              <template v-for="(field, fieldIndex) in fields">
                <slot
                  :name="field.key"
                  :item="item"
                  :index="index"
                  :field="field"
                >
                  <td :key="fieldIndex" class="table-body-cell" :class="[field.tdClass]">
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
                      class="status-chip"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'status'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip
                      class="status-chip"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'prtnContractStatus'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip
                      class="status-chip"
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

              <!-- APPEND ACTIONS -->
              <td v-if="appendAction" class="table-body-cell append-action">
                <slot name="actions" :item="item"> </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </div>
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
            @click="refresh"
          ></v-pagination>
        </v-col>
      </v-row>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.modern-table-wrapper {
  animation: fadeIn 0.3s ease;
}

.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.modern-table {
  border-collapse: collapse;
  width: 100%;

  :deep(table) {
    border-collapse: collapse;
  }

  // Remove all outer borders
  :deep(thead),
  :deep(tbody) {
    border: none;
  }
}

// Header Styles
.table-header-row {
  background: #F8F9FC;
  border-bottom: 1px solid #E8ECF4;

  .table-header-cell {
    padding: 16px 20px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-align: left;
    border: none;
    white-space: nowrap;

    &.prepend-action,
    &.append-action {
      width: 120px;
      text-align: right;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        user-select: none;
      }
    }

    .sort-icon {
      color: #4A90E2;
      flex-shrink: 0;
    }
  }
}

// Body Styles
.table-body-row {
  border-bottom: 1px solid #E8ECF4;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #F8F9FC;
  }

  &:last-child {
    border-bottom: none;
  }

  .table-body-cell {
    padding: 16px 20px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #111827;
    border: none;
    vertical-align: middle;

    &.prepend-action,
    &.append-action {
      width: 120px;
      text-align: right;
    }

    .status-chip {
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
    }
  }
}

// Loading State
.table-loading-row {
  .table-loading-cell {
    padding: 0;
    border: none;

    .loading-wrapper {
      padding: 16px;
    }
  }
}

// Empty State
.table-empty-row {
  .table-empty-cell {
    padding: 48px 20px;
    text-align: center;
    border: none;

    .empty-state {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #6B7280;
    }
  }
}

// Pagination
:deep(.my-custom-pagination) {
  .v-pagination__item,
  .v-pagination__next,
  .v-pagination__prev {
    font-family: 'Poppins', sans-serif;
    border-radius: 8px;

    &--is-active {
      background: #4A90E2 !important;
      color: white;
    }
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive
@media (max-width: 960px) {
  .table-header-cell,
  .table-body-cell {
    padding: 12px 16px !important;
    font-size: 13px !important;
  }

  .table-header-cell {
    &.prepend-action,
    &.append-action {
      width: 100px;
    }
  }

  .table-body-cell {
    &.prepend-action,
    &.append-action {
      width: 100px;
    }
  }
}

@media (max-width: 600px) {
  .table-header-cell,
  .table-body-cell {
    padding: 10px 12px !important;
    font-size: 12px !important;
  }

  .table-header-cell {
    &.prepend-action,
    &.append-action {
      width: 80px;
    }
  }

  .table-body-cell {
    &.prepend-action,
    &.append-action {
      width: 80px;
    }
  }
}
</style>
