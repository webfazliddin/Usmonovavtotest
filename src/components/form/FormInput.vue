<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { FormInputTypes } from "@/models/vuetify/types";
import { VTextField } from "vuetify/components";
import { useI18n } from "vue-i18n";

const props = withDefaults(defineProps<FormInputTypes>(), {
  type: "text",
  mask: "",
  variant: "outlined",
  color: "primary",
  validateOn: "lazy submit",
  clearable: true
});

const customRules = ref<any>([]);
const { t } = useI18n();

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

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "appendInner"): void;
  (e: "blur", value: string): void;
  (e: "focus", value: string): void;
}>();

const model = computed({
  get(): string {
    return props.canAddZero ? props.modelValue : props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue: string): void {
    if (props.upperCase) {
      emits("update:modelValue", newValue.toUpperCase());
    } else {
      emits("update:modelValue", newValue);
    }
  }
});

watch(
  () => [props.required, props.rules],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div class="modern-form-input">
    <v-label v-if="label" class="modern-label">
      {{ label }}
      <span v-if="required && !hideStar" class="required-star">*</span>
    </v-label>
    <v-text-field
      v-if="type !== 'textarea'"
      class="modern-text-field"
      v-bind="props"
      :rules="customRules"
      label=""
      :clearable="!required && clearable"
      :placeholder="placeholder ? placeholder : label"
      v-mask="mask"
      v-model="model"
      :hide-details="!required"
      @click:append-inner="emits('appendInner')"
      @keyup.enter="emits('appendInner')"
      @blur="() => $emit('blur', model)"
      @focus="() => $emit('focus', model)"
    >
      <!-- @vue-ignore -->
      <template v-for="(_, name) in ($slots as Record<string, any>)" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-text-field>
    <v-textarea
      v-else
      class="modern-text-field"
      v-bind="props"
      :rules="customRules"
      label=""
      :clearable="!required && clearable"
      :placeholder="placeholder ? placeholder : label"
      v-mask="mask"
      v-model="model"
      :hide-details="!required"
      @click:append-inner="emits('appendInner')"
      @keyup.enter="emits('appendInner')"
      @blur="() => $emit('blur', model)"
      @focus="() => $emit('focus', model)"
    >
      <!-- @vue-ignore -->
      <template v-for="(_, name) in ($slots as Record<string, any>)" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-textarea>
  </div>
</template>

<style scoped lang="scss">
.modern-form-input {
  .modern-label {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    display: block;

    .required-star {
      color: #EF4444;
      margin-left: 2px;
    }
  }

  .modern-text-field {
    :deep(.v-input__control) {
      border-radius: 8px !important;
    }

    :deep(.v-field) {
      background: #FFFFFF !important;
      border-radius: 8px !important;
      border: 1px solid #E8ECF4 !important;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;

      &:hover {
        border-color: #4A90E2 !important;
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
      }
    }

    :deep(.v-field__overlay) {
      border-radius: 8px !important;
    }

    :deep(.v-field--focused) {
      border-color: #4A90E2 !important;
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.12);
    }

    :deep(.v-field--error) {
      border-color: #EF4444 !important;
    }

    :deep(.v-field__input) {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #111827;
      padding: 12px 16px;
      min-height: 48px;

      &::placeholder {
        color: #9CA3AF;
        opacity: 1;
      }
    }

    :deep(.v-field__outline) {
      display: none !important;
    }

    :deep(.v-field__append-inner) {
      padding-right: 12px;
      color: #6B7280;

      .v-icon {
        opacity: 0.7;
        transition: all 0.2s ease;

        &:hover {
          opacity: 1;
          color: #4A90E2;
        }
      }
    }
  }
}
</style>
