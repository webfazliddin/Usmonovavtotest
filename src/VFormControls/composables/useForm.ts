// Composables

// Utilities
import {
  inject,
  markRaw,
  provide,
  ref,
  shallowRef,
  toRef,
  watch,
} from "vue";

// Types
import type {
  ComponentInternalInstance,
  InjectionKey,
  PropType,
  Raw,
  Ref,
} from "vue";
import type { ValidationProps } from "./validation";
import { useProxiedModel } from "./proxieModel";
import type { EventProp } from "../util";
import { propsFactory } from "../util/propsFactory";

export interface FormProvide {
  register: (item: {
    id: number | string;
    vm: ComponentInternalInstance;
    validate: () => Promise<string[]>;
    reset: () => Promise<void>;
    resetValidation: () => Promise<void>;
  }) => void;
  unregister: (id: number | string) => void;
  update: (
    id: number | string,
    isValid: boolean | null,
    errorMessages: string[]
  ) => void;
  items: Ref<FormField[]>;
  isValidating?: Ref<boolean>;
  isValid?: Ref<boolean | null | undefined>;
  validateOn?: Ref<FormProps["validateOn"]>;
}

export interface FormField {
  id: number | string;
  validate: () => Promise<string[]>;
  reset: () => Promise<void>;
  resetValidation: () => Promise<void>;
  vm: Raw<ComponentInternalInstance>;
  isValid: boolean | null;
  errorMessages: string[];
}

export interface FieldValidationResult {
  id: number | string;
  errorMessages: string[];
}

export interface FormValidationResult {
  valid: boolean;
  errors: FieldValidationResult[];
}

export interface SubmitEventPromise
  extends SubmitEvent,
    Promise<FormValidationResult> {}

export const FormKey: InjectionKey<FormProvide> = Symbol.for("form");

export interface FormProps {
  modelValue?: boolean | null;
  "onUpdate:modelValue": EventProp<[boolean | null]> | undefined;
  validateOn?: ValidationProps["validateOn"];
}

export const makeFormProps = propsFactory(
  {
    modelValue: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    validateOn: {
      type: String as PropType<FormProps["validateOn"]>,
      default: "input",
    },
  },
  "form"
);

export function createForm(props: FormProps) {
  const model = useProxiedModel(props, "modelValue");
  const isValidating = shallowRef(false);
  const items = ref<FormField[]>([]);
  const errors = ref<FieldValidationResult[]>([]);

  async function validate() {
    const results: any[] = [];
    let valid = true;

    errors.value = [];
    isValidating.value = true;
    for (const item of items.value) {
      const itemErrorMessages = await item.validate();

      if (itemErrorMessages.length > 0) {
        valid = false;

        results.push({
          id: item.id,
          errorMessages: itemErrorMessages,
        });
      }

      // if (!valid) break;
    }

    errors.value = results;
    isValidating.value = false;

    return { valid, errors: errors.value };
  }

  function reset() {
    items.value.forEach((item) => item.reset());
  }

  function resetValidation() {
    items.value.forEach((item) => item.resetValidation());
  }

  watch(
    items,
    () => {
      let valid = 0;
      let invalid = 0;
      const results: any[] = [];

      for (const item of items.value) {
        if (item.isValid === false) {
          invalid++;
          results.push({
            id: item.id,
            errorMessages: item.errorMessages,
          });
        } else if (item.isValid === true) valid++;
      }

      errors.value = results;
      model.value =
        invalid > 0 ? false : valid === items.value.length ? true : null;
    },
    { deep: true, flush: "post" }
  );

  provide(FormKey, {
    register: ({ id, vm, validate, reset, resetValidation }) => {
      if (items.value.some((item) => item.id === id)) {
        console.warn(`Duplicate input name "${id}"`);
      }

      items.value.push({
        id,
        validate,
        reset,
        resetValidation,
        vm: markRaw(vm),
        isValid: null,
        errorMessages: [],
      });
    },
    unregister: (id) => {
      items.value = items.value.filter((item) => {
        return item.id !== id;
      });
    },
    update: (id, isValid, errorMessages) => {
      const found = items.value.find((item) => item.id === id);

      if (!found) return;

      found.isValid = isValid;
      found.errorMessages = errorMessages;
    },
    isValidating,
    isValid: model,
    items,
    validateOn: toRef(props, "validateOn"),
  });

  return {
    errors,
    isValidating,
    isValid: model,
    items,
    validate,
    reset,
    resetValidation,
  };
}

export function useForm() {
  return inject(FormKey, null);
}