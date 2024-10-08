<script setup lang="ts">
import { computed } from "vue";
import { useValidation } from "../composables/validation";
import { getUid } from "../util";
import VMessage from "../VMessage.vue";
import { useI18n } from "vue-i18n";

interface IProps {
  id?: string;
  validateOn?:
    | "lazy"
    | ("input" | "blur" | "submit")
    | "input lazy"
    | "blur lazy"
    | "submit lazy"
    | "lazy input"
    | "lazy blur"
    | "lazy submit"
    | undefined;
  rules?: any[];
  required?: boolean;
  modelValue?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  type: "text",
  rules: () => [],
  validateOn: "submit lazy",
});

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const { t } = useI18n();

const uid = getUid();
const id = computed(() => props.id || `input-${uid}`);

const requiredRules = [
  (value: any) => {
    if (value) return true;

    return t("fieldNotEmpty");
  },
];

const checkRules = () => {
  if (props.rules?.length) {
    return props.rules;
  }
  if (!props.rules?.length && props.required) {
    return requiredRules;
  }
  return [];
};

const {
  errorMessages,
  isValid,
  isValidating,
  reset,
  resetValidation,
  validate,
} = useValidation(
  //@ts-ignore
  props,
  id,
  checkRules()
);

const onInput = () => {
  if (errorMessages.value.length) {
    validate();
  }
};
</script>

<template>
  <div>
    <slot
      :id="id"
      :errorMessages="errorMessages"
      :isValid="isValid"
      :isValidating="isValidating"
      :reset="reset"
      :resetValidation="resetValidation"
      :validate="validate"
      :onInput="onInput"
    ></slot>
    <VMessage v-if="required" :messages="errorMessages" />
  </div>
</template>

<style lang="scss" scoped></style>
