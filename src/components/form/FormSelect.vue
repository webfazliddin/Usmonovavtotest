<script setup lang="ts">
import { FormSelectTypes } from "@/models/vuetify/types";
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(defineProps<FormSelectTypes>(), {
  variant: "outlined",
  color: "primary",
  itemTitle: "text",
  itemValue: "value",
  disabled: false,
  hideDetails: true,
  placeholder: "ChooseBelow",
  validateOn: "lazy submit",
  clearable: true
});

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "append"): void;
  (e: "appendInner"): void;
  (e: "clear"): void;
  (e: "prepend"): void;
  (e: "prependInner"): void;
}>();
// @ts-ignore
const model = computed({
  get(): string {
    return props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue: string): void {
    emits("update:modelValue", newValue);
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
  <div>
    <v-label class="mb-2 font-weight-medium" v-if="label">
      {{ label }}
      <span v-if="required && !hideStar" style="color: red">*</span>
    </v-label>
    <!-- @vue-skip-->
    <v-select
      v-if="noSearch"
      v-bind="props"
      v-model="model"
      :items="list"
      label=""
      :hideDetails="!required"
      :placeholder="t(placeholder)"
      :no-data-text="t('NoData')"
      :rules="customRules"
      :closable-chips="multiple"
      :clearable="!required && clearable"
      @click:append="emits('append')"
      @click:append-inner="emits('appendInner')"
      @click:clear="emits('clear')"
      @click:prepend="emits('prepend')"
      @click:prepend-inner="emits('prependInner')"
    >
      <template v-slot:chip="{ props }" v-if="multiple">
        <v-chip v-bind="props"></v-chip>
      </template>
    </v-select>
    <v-autocomplete
      v-else
      v-bind="props"
      v-model="model"
      :items="list"
      label=""
      :placeholder="t(placeholder)"
      :no-data-text="t('NoData')"
      :rules="customRules"
      :clearable="!required && clearable"
      :closable-chips="multiple"
      :hideDetails="!required"
      @click:append="emits('append')"
      @click:append-inner="emits('appendInner')"
      @click:clear="emits('clear')"
      @click:prepend="emits('prepend')"
      @click:prepend-inner="emits('prependInner')"
    >
      <template v-slot:chip="{ props }" v-if="multiple">
        <v-chip v-bind="props"></v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>
