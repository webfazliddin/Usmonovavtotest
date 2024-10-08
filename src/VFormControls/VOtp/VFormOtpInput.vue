<script lang="ts" setup>
import { ref, watch } from "vue";
import SingleOtpInput from "./single-otp-input.vue";
import VInput from "../VInput/VInput.vue";
import { useProxiedModel } from "../composables/proxieModel";
import type { EventProp } from "../util";
import { useI18n } from "vue-i18n";

// keyCode constants
const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;

type Props = {
  modelValue: string;
  digitCount?: number;
  separator?: string;
  inputClasses?: string | string[];
  conditionalClass?: string[];
  inputType?: "number" | "tel" | "letter-numeric" | "password";
  inputmode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  shouldAutoFocus?: boolean;
  placeholder?: string[];
  isDisabled?: boolean;
  shouldFocusOrder?: boolean;
  "onUpdate:modelValue"?: EventProp<[number | null]> | undefined;
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
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  digitCount: 6,
  separator: "",
  inputClasses: "",
  inputmode: "text",
  shouldAutoFocus: true,
});

const model = useProxiedModel(props, "modelValue");
const { t } = useI18n();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "on-change", value: string): void;
  (e: "on-complete", value: string): void;
}>();

const activeInput = ref<number>(0);
const otp = ref<string[]>([]);
const oldOtp = ref<string[]>([]);

const requiredRules = [
  (value: unknown) => {
    if (value && String(value).length == props.digitCount) return true;
    if (!value) return t("fieldNotEmpty");

    return t("fieldNotFull");
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

watch(
  () => props.modelValue,
  (val) => {
    if (val.length === props.digitCount || otp.value.length === 0) {
      const fill = val.split("");
      otp.value = fill;
    }
  },
  { immediate: true }
);

const handleOnFocus = (index: number) => {
  activeInput.value = index;
};
const handleOnBlur = () => {
  activeInput.value = -1;
};

// Helper to return OTP from input
const checkFilledAllInputs = () => {
  if (otp.value.join("").length === props.digitCount) {
    emit("update:modelValue", otp.value.join(""));
    return emit("on-complete", otp.value.join(""));
  }
  return "Wait until the user enters the required number of characters";
};

// Focus on input by index
const focusInput = (input: number) => {
  activeInput.value = Math.max(Math.min(props.digitCount - 1, input), 0);
};
// Focus on next input
const focusNextInput = () => {
  focusInput(activeInput.value + 1);
};
// Focus on previous input
const focusPrevInput = () => {
  focusInput(activeInput.value - 1);
};

// Change OTP value at focused input
const changeCodeAtFocus = (value: number | string) => {
  oldOtp.value = Object.assign([], otp.value);

  otp.value[activeInput.value] = value.toString();

  if (oldOtp.value.join("") !== otp.value.join("")) {
    emit("update:modelValue", otp.value.join(""));
    emit("on-change", otp.value.join(""));
    checkFilledAllInputs();
  }
};

// Handle pasted OTP
const handleOnPaste = (event: any) => {
  event.preventDefault();
  const pastedData = event.clipboardData
    .getData("text/plain")
    .slice(0, props.digitCount - activeInput.value)
    .split("");
  if (props.inputType === "number" && !pastedData.join("").match(/^\d+$/)) {
    return "Invalid pasted data";
  }

  if (
    props.inputType === "letter-numeric" &&
    !pastedData.join("").match(/^\w+$/)
  ) {
    return "Invalid pasted data";
  }
  // Paste data from focused input onwards
  const currentCharsInOtp = otp.value.slice(0, activeInput.value);
  const combinedWithPastedData = currentCharsInOtp.concat(pastedData);

  combinedWithPastedData
    .slice(0, props.digitCount)
    .forEach(function (value, i) {
      otp.value[i] = value;
    });

  focusInput(combinedWithPastedData.slice(0, props.digitCount).length);
  return checkFilledAllInputs();
};

const handleOnChange = (value: number | string) => {
  changeCodeAtFocus(value);
  focusNextInput();
};
const clearInput = () => {
  if (otp.value.length > 0) {
    emit("update:modelValue", "");
    emit("on-change", "");
  }
  otp.value = [];
  activeInput.value = 0;
};

const fillInput = (value: string) => {
  const fill = value.split("");
  if (fill.length === props.digitCount) {
    otp.value = fill;
    emit("update:modelValue", otp.value.join(""));
    emit("on-complete", otp.value.join(""));
  }
};

// Handle cases of backspace, delete, left arrow, right arrow
const handleOnKeyDown = (event: KeyboardEvent, index: number) => {
  switch (event.keyCode) {
    case BACKSPACE:
      event.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
      break;
    case DELETE:
      event.preventDefault();
      changeCodeAtFocus("");
      break;
    case LEFT_ARROW:
      event.preventDefault();
      focusPrevInput();
      break;
    case RIGHT_ARROW:
      event.preventDefault();
      focusNextInput();
      break;
    default:
      focusOrder(index);
      break;
  }
};

/**
 *
 * @param currentIndex - index of the input
 * @description - This function is used to focus the input in the order of the input index
 *
 * @example
 * 1. If the user is entering the OTP in the order of the input index, then the input will be focused in the order of the input index
 * 2. If the user is entering the OTP in the reverse order of the input index, then the input will be focused in the reverse order of the input index
 */
const focusOrder = (currentIndex: number) => {
  if (props.shouldFocusOrder) {
    setTimeout(() => {
      const len = otp.value.join("").length;
      if (currentIndex - len >= 0) {
        activeInput.value = len;
        otp.value[currentIndex] = "";
      }
    }, 100);
  }
};

defineExpose({
  clearInput,
  fillInput,
});
</script>

<template>
  <!--  -->
  <VInput
    v-bind="props"
    :rules="checkRules()"
    #default="{ errorMessages }"
    v-model:model-value="model"
  >
    <div :class="`flex grid-cols-${digitCount} md:gap-3`">
      <input
        v-if="inputType === 'password'"
        autocomplete="off"
        name="hidden"
        type="text"
        style="display: none"
      />
      <template v-for="(_, i) in digitCount">
        <SingleOtpInput
          :focus="activeInput === i"
          :value="otp[i]"
          :separator="separator"
          :input-type="inputType"
          :inputmode="inputmode"
          :conditionalClass="conditionalClass?.[i]"
          :is-last-child="i === digitCount - 1"
          :should-auto-focus="shouldAutoFocus"
          :placeholder="placeholder?.[i]"
          :is-disabled="isDisabled"
          :input-classes="[
            `otp-input`,
            {
              '!border-danger-default': !otp[i] && errorMessages.length > 0,
              '!border-success': otp[i] && required,
            },
          ]"
          @on-change="handleOnChange"
          @on-keydown="handleOnKeyDown($event, i)"
          @on-paste="handleOnPaste"
          @on-focus="handleOnFocus(i)"
          @on-blur="handleOnBlur"
        />
      </template>
    </div>
  </VInput>
</template>
<style lang="scss">
.otp-input {
  height: 3rem;
  /* width: 2rem; */
  border: 1px solid #dfe0e3;
  display: inline-block;
  border-radius: 5px;
  margin: 5px;
  // padding: 15px;
  font-size: 2rem;
  text-align: center;
  @media screen and (max-width: 600px) {
    padding: 1px;
    font-size: 1.5rem;
    height: 3rem;
  }
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input.error {
  border: 1px solid red !important;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp-input {
  input::placeholder {
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
}
</style>
