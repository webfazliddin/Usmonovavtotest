<script setup lang="ts">
import { CheckboxTypes } from "@/models/vuetify/types";
import { watch, ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(defineProps<CheckboxTypes>(), {
  validateOn: "lazy submit",
  type: "checkbox"
});

const customRules = ref<any>([]);
const { t } = useI18n();

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "update:focused", value: any): void;
  (e: "clickAppend", value: any): void;
  (e: "clickPrepend", value: any): void;
}>();

const model = computed({
  get(): string {
    return props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue: string): void {
    emits("update:modelValue", newValue);
  }
});

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

const clickAppend = (value: any) => {
  emits("clickAppend", value);
};
const clickPrepend = (value: any) => {
  emits("clickAppend", value);
};
</script>

<template>
  <div>
    <v-checkbox
      v-if="type === 'checkbox'"
      v-bind="props"
      v-model="model"
      :rules="customRules"
      :hideDetails="!required"
      @click:append="clickAppend"
      @click:prepend="clickPrepend"
    >
      <template v-slot:label>
        {{ label }}
        <span v-if="required" style="color: red">*</span>
      </template>
    </v-checkbox>
    <v-radio
      v-if="type === 'radio'"
      v-bind="props"
      v-model="model"
      :rules="customRules"
      :hideDetails="!required"
      @click:append="clickAppend"
      @click:prepend="clickPrepend"
    >
      <template v-slot:label>
        {{ label }}
        <span v-if="required" style="color: red">*</span>
      </template>
    </v-radio>
  </div>
</template>
