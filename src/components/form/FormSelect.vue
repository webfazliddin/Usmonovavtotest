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
  clearable: true,
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
  get() {
    return props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  },
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
      },
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
  <div class="modern-form-select">
    <v-label class="modern-label" v-if="label">
      {{ label }}
      <span v-if="required && !hideStar" class="required-star">*</span>
    </v-label>
    <!-- @vue-skip-->
    <v-select
      v-if="noSearch"
      class="modern-select-field"
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
      class="modern-select-field"
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

<style scoped lang="scss">
.modern-form-select {
  .modern-label {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 8px;
    display: block;

    .required-star {
      color: #EF4444;
      margin-left: 2px;
    }
  }

  .modern-select-field {
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
        border-color: #5D87FF !important;
      }
    }

    :deep(.v-field__overlay) {
      border-radius: 8px !important;
    }

    :deep(.v-field--focused) {
      border-color: #5D87FF !important;
    }

    :deep(.v-field--error) {
      border-color: #EF4444 !important;
    }

    :deep(.v-field__input) {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #1F2937;
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
          color: #5D87FF;
        }
      }
    }

    :deep(.v-select__selection-text) {
      font-family: 'Poppins', sans-serif;
      color: #1F2937;
    }

    :deep(.v-chip) {
      background: #EFF4FF;
      color: #5D87FF;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
    }
  }
}

// Dropdown menu styles
:deep(.v-list) {
  border-radius: 10px;
  padding: 8px;

  .v-list-item {
    border-radius: 8px;
    margin-bottom: 4px;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s ease;

    &:hover {
      background: #F9FAFB;
    }

    &--active {
      background: #EFF4FF;
      color: #5D87FF;

      &:hover {
        background: #EFF4FF;
      }
    }
  }

  .v-list-item-title {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
  }
}
</style>
