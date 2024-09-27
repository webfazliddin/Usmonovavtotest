<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { IFields } from "@/models/basic";
import { reactive, ref } from "vue";

interface IProps {
  field: IFields;
  fieldIndex: number;
  index: number;
  item: any;
  allData: any;
  data: any[];
}

defineProps<IProps>();

const { parseNumber, getColor } = useGlobal();

const textRef = ref();
const isCollapsed = ref(false);

const style = reactive({
  width: "auto",
  cursor: "auto"
});

const setIsCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
  if (textRef.value) {
    const lineHeight = parseInt(window.getComputedStyle(textRef.value).lineHeight);
    const height = textRef.value.scrollHeight;

    const rows = Math.floor(height / lineHeight);
    style.width = "auto";
    style.cursor = "auto";

    if (rows > 3) {
      style.cursor = "pointer";
      if (isCollapsed.value) {
        style.width = "200px";
      }
    }
  }
};
</script>

<template>
  <td :key="fieldIndex" :class="[field.tdClass, '']">
    <div
      class=""
      @click="setIsCollapsed"
      ref="textRef"
      :style="style"
      :class="[
        {
          'limited-text': !isCollapsed
        }
      ]"
    >
      <template v-if="field.key != 'status' && field.key != 'prtnContractStatus' && field.key != 'state'">
        <slot :name="field.key" :item="item" :index="index" :field="field" :data="allData" :rows="data">
          {{ field.isAmount ? parseNumber(item[field.key]) : item[field.key] }}
        </slot>
      </template>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'status'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'prtnContractStatus'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
      <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'state'" :color="getColor(item)">
        {{ item[field.key] }}
      </v-chip>
    </div>
  </td>
</template>

<style lang="scss" scoped></style>
