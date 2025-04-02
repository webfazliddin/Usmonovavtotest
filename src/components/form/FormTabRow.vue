<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { IFields, ITableActions } from "@/models/basic";
import { PencilIcon, TrashIcon, XIcon } from "vue-tabler-icons";

interface IProps {
  items: any[];
  fields?: IFields[];
  actions?: ITableActions;
  editIndex?: number;
  tableHeight?: string;
}

withDefaults(defineProps<IProps>(), {
  editIndex: -1,
  tableHeight: "",
});

const emits = defineEmits<{
  (e: "editTabRow", item: any): void;
  (e: "clearTabRow"): void;
  (e: "deleteTabRow", index: number): void;
  (e: "update:editIndex", index: number): void;
}>();
</script>

<template>
  <UiParentCard class="mt-4">
    <slot name="card-header"> </slot>
    <slot :editIndex="editIndex"> </slot>
    <v-row>
      <v-card elevation="0" class="border mt-3">
        <v-table fixedHeader :height="tableHeight">
          <thead>
            <tr>
              <th
                :rowspan="field.thRowSpan"
                :colspan="field.thColSpan"
                :class="field.thClass"
                v-for="field in fields"
              >
                {{ $t(field.label) }}
              </th>
            </tr>
            <slot name="customFieldsHeader"></slot>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items">
              <template v-for="field in fields">
                <slot
                  :name="field.key"
                  :item="item"
                  :index="index"
                  :field="field"
                >
                  <td
                    :rowspan="field.tdRowSpan"
                    :colspan="field.thColSpan"
                    :class="field.tdClass"
                    v-if="field.key !== 'action'"
                  >
                    {{
                      field.isAmount
                        ? Intl.NumberFormat(undefined, {}).format(
                            item[field.key]
                          )
                        : item[field.key]
                    }}
                  </td>
                </slot>
                <td
                  v-if="actions && field.key === 'action'"
                  class="border"
                  :rowspan="field.tdRowSpan"
                  :colspan="field.thColSpan"
                  :class="field.tdClass"
                >
                  <div class="text-center d-flex align-center flex-wrap">
                    <div style="margin-right: 5px" v-if="actions.isEdit">
                      <PencilIcon
                        size="20"
                        style="cursor: pointer"
                        v-if="editIndex !== index"
                        @click="emits('editTabRow', item)"
                      />
                      <XIcon
                        size="20"
                        style="cursor: pointer"
                        v-else
                        @click="
                          () => {
                            emits('clearTabRow');
                            emits('update:editIndex', -1);
                          }
                        "
                      />

                      <v-tooltip
                        v-if="editIndex === -1"
                        activator="parent"
                        location="top"
                      >
                        {{ $t("Edit") }}
                      </v-tooltip>
                    </div>
                    <div
                      style="margin-right: 5px"
                      v-if="actions.isDelete && editIndex == -1"
                    >
                      <TrashIcon
                        size="20"
                        style="cursor: pointer"
                        @click="emits('deleteTabRow', index)"
                      />
                      <v-tooltip activator="parent" location="top">
                        {{ $t("Delete") }}
                      </v-tooltip>
                    </div>
                    <slot
                      name="actions"
                      :item="item"
                      :index="index"
                      :editIndex="editIndex"
                    ></slot>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-row>
  </UiParentCard>
</template>
