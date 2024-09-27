<script setup lang="ts">
import { FormInputTypes } from "@/models/vuetify/types";
import { computed, watch, ref } from "vue";

import DatePicker from "vue-datepicker-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface IProps extends FormInputTypes {
  format?: string;
  hourOptions?: any;
  disabledDate?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  format: "DD.MM.YYYY",
  mask: "##.##.####",
  type: "date",
  placeholder: "DD.MM.YYYY",
  clearable: false,
  validateOn: "lazy submit"
});

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const updateVal = computed({
  get() {
    return props.modelValue;
  },
  set(newVal): void {
    emits("update:modelValue", newVal);
  }
});

const customRules = ref<any>([]);

const setRules = () => {
  if (props.required) {
    if (props.rules && props.rules.length > 0) {
      customRules.value = props.rules;
      return;
    }
    customRules.value = [
      (value: any) => {
        if (value) return true;
        // @ts-ignore
        return t("fieldNotEmpty");
      }
    ];
  } else {
    customRules.value = [];
  }
};

watch(
  () => [props.required, props.rules],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div style="display: flex; flex-direction: column" :style="`--divider:${required ? -50 : 0}%;`">
    <v-label class="mb-2 font-weight-medium wrap" v-if="label">
      {{ label }}
      <span v-if="required" style="color: red">*</span></v-label
    >
    <DatePicker
      v-model:value="updateVal"
      value-type="format"
      class="w-100 calendar"
      :format="format"
      v-mask="mask"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="!required || clearable"
      :hour-options="hourOptions"
      :disabled-date="disabledDate"
    >
      <template #input>
        <v-text-field
          class="w-100"
          variant="outlined"
          v-mask="mask"
          v-model="updateVal"
          :disabled="disabled"
          :placeholder="placeholder"
          :rules="customRules"
          color="primary"
          :hide-details="!required"
          :validate-on="validateOn"
        ></v-text-field>
      </template>
    </DatePicker>
  </div>
</template>
