<script setup lang="ts">
import { nextTick, ref, toRefs, watch } from "vue";
import type { FormInputTypes } from "@/models/vuetify/types";
import { useCheckPhoneNumber } from "@/composables/CheckPhoneNumber";
import FormInput from "./FormInput.vue";
import { mask } from "maska";

const props = withDefaults(defineProps<FormInputTypes>(), {
  type: "text",
  variant: "outlined",
  color: "primary",
  validateOn: "lazy submit",
  clearable: true
});

const emits = defineEmits(["update:modelValue"]);

const { required } = toRefs(props);

const { phoneNumberRules, setIsRequiredPhoneNumber, notRequiredPhoneNumberRules, set } = useCheckPhoneNumber();

const maskPattern = "+998 (##) ### ## ##";
const inputRef = ref<HTMLInputElement | null>(null);
const displayValue = ref<string | null>(null);

const onFocus = () => {
  if (String(displayValue.value).length <= 4 && required.value) {
    displayValue.value = "+998";
  }

  emits("update:modelValue", set(displayValue.value));
};

const onType = () => {
  if (!required.value && displayValue.value?.length == 1) {
    displayValue.value = null;
  }

  if (!displayValue.value && displayValue.value?.length == 0) {
    displayValue.value = null;
  }

  if (displayValue.value?.length) {
    emits("update:modelValue", set(displayValue.value)?.trimStart());
  } else {
    emits("update:modelValue", null);
  }
};

const handleMask = (val: string) => {
  const formetter = mask(val, maskPattern);
  displayValue.value = formetter;

  emits("update:modelValue", set(displayValue.value));
};

const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  let val = displayValue.value;

  if (event.clipboardData) {
    const pastedData = event.clipboardData.getData("text/plain");
    if (pastedData.includes("+998")) {
      val = pastedData;
    } else {
      val = `+998${pastedData}`;
    }

    await nextTick();
    handleMask(val);
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      handleMask(val);
    }
  },
  { immediate: true }
);
</script>

<template>
  <FormInput
    v-bind="props"
    ref="inputRef"
    v-model="displayValue"
    :mask="maskPattern"
    :rules="required ? phoneNumberRules : notRequiredPhoneNumberRules"
    :required="required ? required : setIsRequiredPhoneNumber(displayValue)"
    @focus="onFocus"
    @input="onType"
    @paste="handlePaste"
    clearable
  />
</template>

<style lang="scss" scoped></style>
