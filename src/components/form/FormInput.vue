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
  <div>
    <v-label v-if="label" class="mb-2 font-weight-medium">
      {{ label }}
      <span v-if="required && !hideStar" style="color: red">*</span>
    </v-label>
    <v-text-field
      v-if="type !== 'textarea'"
      class="w-100"
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
      class="w-100"
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
