// Composables

// Utilities
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from "vue";

// Types
import type { MaybeRef, PropType } from "vue";
import { propsFactory } from "../util/propsFactory";
import { getCurrentInstance, getUid, wrapInArray, type EventProp } from "../util";
import { useProxiedModel } from "./proxieModel";
import { useForm } from "./useForm";
import { useToggleScope } from "./toggleScope";

export type ValidationResult = string | boolean;
export type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>);

type ValidateOnValue = "blur" | "input" | "submit";

export interface ValidationProps {
  disabled: boolean | null;
  error: boolean;
  errorMessages: string | readonly string[] | null;
  focused: boolean;
  maxErrors: string | number;
  name: string | undefined;
  label: string | undefined;
  readonly: boolean | null;
  modelValue: any;
  "onUpdate:modelValue": EventProp | undefined;
  validateOn?: ValidateOnValue | `${ValidateOnValue} lazy` | `lazy ${ValidateOnValue}` | "lazy";
  validationValue: any;
  required?: boolean;
}

export const makeValidationProps = propsFactory(
  {
    disabled: {
      type: Boolean as PropType<boolean | null>,
      default: null
    },
    error: Boolean,
    errorMessages: {
      type: [Array, String] as PropType<string | readonly string[] | null>,
      default: () => []
    },
    maxErrors: {
      type: [Number, String],
      default: 1
    },
    name: String,
    label: String,
    readonly: {
      type: Boolean as PropType<boolean | null>,
      default: null
    },
    modelValue: null,
    validateOn: String as PropType<ValidationProps["validateOn"]>,
    validationValue: null
  },
  "validation"
);

export function useValidation(props: ValidationProps, id: MaybeRef<string | number> = getUid(), rules:ValidationRule[]) {
  const model = useProxiedModel(props, "modelValue");
  const validationModel = computed(() => (props.validationValue === undefined ? model.value : props.validationValue));
  const form = useForm();
  const internalErrorMessages = ref<string[]>([]);
  const isPristine = shallowRef(true);

  const errorMessages = computed(() => {
    return props.errorMessages?.length
      ? wrapInArray(props.errorMessages).concat(internalErrorMessages.value).slice(0, Math.max(0, +props.maxErrors))
      : internalErrorMessages.value;
  });
  const validateOn = computed(() => {
    let value = (props.validateOn ?? form?.validateOn?.value) || "input";
    if (value === "lazy") value = "input lazy";
    const set = new Set(value?.split(" ") ?? []);

    return {
      blur: set.has("blur") || set.has("input"),
      input: set.has("input"),
      submit: set.has("submit"),
      lazy: set.has("lazy")
    };
  });

  const isValid = computed(() => {
    if (props.error || props.errorMessages?.length) return false;
    if (!rules.length) return true;
    if (isPristine.value) {
      return internalErrorMessages.value.length || validateOn.value.lazy ? null : true;
    } else {
      return !internalErrorMessages.value.length;
    }
  });

  const isValidating = shallowRef(false);

  const vm = getCurrentInstance("validation");
  const uid = computed(() => props.name ?? unref(id));

  onBeforeMount(() => {
    form?.register({
      id: uid.value,
      vm,
      validate,
      reset,
      resetValidation
    });
  });

  onBeforeUnmount(() => {
    form?.unregister(uid.value);
  });

  onMounted(async () => {
    if (!validateOn.value.lazy) {
      await validate(true);
    }
    form?.update(uid.value, isValid.value, errorMessages.value);
  });

  useToggleScope(
    () => validateOn.value.input,
    () => {
      watch(validationModel, () => {
        if (validationModel.value != null) {
          validate();
        } else if (props.focused) {
          const unwatch = watch(
            () => props.focused,
            (val) => {
              if (!val) validate();

              unwatch();
            }
          );
        }
      });
    }
  );

  useToggleScope(
    () => validateOn.value.blur,
    () => {
      watch(
        () => props.focused,
        (val) => {
          if (!val) validate();
        }
      );
    }
  );

  watch([isValid, errorMessages], () => {
    form?.update(uid.value, isValid.value, errorMessages.value);
  });

  async function reset() {
    model.value = null;
    await nextTick();
    await resetValidation();
  }

  async function resetValidation() {
    isPristine.value = true;
    if (!validateOn.value.lazy) {
      await validate(true);
    } else {
      internalErrorMessages.value = [];
    }
  }

  async function validate(silent = false) {
    const results: any[] = [];

    isValidating.value = true;

    for (const rule of rules) {
      if (results.length >= +(props.maxErrors ?? 1)) {
        break;
      }

      const handler = typeof rule === "function" ? rule : () => rule;
      const result = await handler(validationModel.value);

      if (result === true) continue;

      if (result !== false && typeof result !== "string") {
        // eslint-disable-next-line no-console
        console.warn(`${result} is not a valid value. Rule functions must return boolean true or a string.`);
        continue;
      }

      results.push(result || "");
    }

    internalErrorMessages.value = results;
    isValidating.value = false;
    isPristine.value = silent;

    return internalErrorMessages.value;
  }

  return {
    errorMessages,
    isValid,
    isValidating,
    reset,
    resetValidation,
    validate
  };
}
