<script setup lang="ts">
import type { FormInputTypes } from "@/models/components";
import { ref } from "vue";
import VInput from "@/VFormControls/VInput/VInput.vue";
import VLabel from "@/VFormControls/VLabel.vue";
import { useProxiedModel } from "@/VFormControls/composables/proxieModel";
import type { EventProp } from "@/VFormControls/util";

interface IProps extends FormInputTypes {
  "onUpdate:modelValue"?: EventProp<[boolean | null]> | undefined;
}

const inputProps = withDefaults(defineProps<IProps>(), {
  type: "text",
  clearable: false,
  append: false,
  appendLoading: false,
  rules: () => [],
  validateOn: "submit lazy",
  size: "md",
  hasBorder: true,
});

const emits = defineEmits(["update:modelValue", "click:clearable"]);

const domRef = ref();
const model = useProxiedModel(inputProps, "modelValue");

const clearModel = () => {
  model.value = "";
  emits("click:clearable");
};

const onType = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target) {
    let length = Number(target.dataset.length);
    if (target.value.length > length) {
      target.value = target.value.slice(0, length);
    }
  }
};
</script>

<template>
  <VInput
    v-bind="inputProps"
    #default="{ id, errorMessages, onInput, isValid }"
    v-model:model-value="model"
  >
    <div
      ref="domRef"
      class="field rounded-lg w-full h-full"
      :class="{
        'border-danger-default': errorMessages.length,
        'border-[var(--primary)]': isValid && required,
        'border border-solid border-gray-200': hasBorder,
      }"
    >
      <VLabel
        :for="id"
        :class="[
          'text-xs  flex relative gap-1 w-full h-full',
          {
            'pr-1.5 pl-2': size === 'sm',
            'pr-2 pl-3': size === 'sm:md',
            'pr-4 pl-5': size === 'md',
          },
        ]"
      >
        <slot name="prepend"> </slot>
        <div
          :class="[
            'flex flex-col justify-start items-start flex-1 w-full h-full',
            {
              'pt-1': size === 'sm',
              'pt-2.5': size === 'sm:md',
              'pt-4': size === 'md',
            },
          ]"
        >
          <div class="w-full" v-if="label">
            {{ label }}
            <span v-if="required" style="color: red">*</span>
          </div>

          <div
            :class="[
              'w-full h-full flex items-center',
              {
                'pb-1': size === 'sm',
                'pb-2.5': size === 'sm:md',
                'pb-4': size === 'md',
              },
            ]"
          >
            <slot name="prependText" v-if="prependText">
              <div class="prepend-text mt-0.5 text-sm text text-black leading-3 ">
                {{ prependText }}
              </div>
            </slot>
            <textarea
              v-if="type == 'textarea'"
              :id="id"
              rows="4"
              class="block w-full h-full text-sm text-gray-900 bg-gray-50 rounded-lg focus:border-none"
              v-bind="$attrs"
              v-model="model"
              :disabled="disabled"
              :placeholder="placeholder"
              :data-maska="mask"
              :data-length="inputProps.maxLength"
              :type="type"
              :name="name"
              @input="onInput(), onType($event)"
              :class="[
                'w-full h-full outline-none text-dark text-sm',
                {
                  'pr-2': appendText || append || clearable,
                },
              ]"
            >
            </textarea>
            <input
              v-else
              :data-maska="mask"
              v-mask
              v-model="model"
              :disabled="disabled"
              :placeholder="placeholder"
              :type="type"
              :name="name"
              :data-length="inputProps.maxLength"
              :class="[
                'w-full h-full outline-none text-black text-sm',
                {
                  'pr-2': appendText || append || clearable,
                },
              ]"
              @input="onInput(), onType($event)"
              v-bind="$attrs"
              :id="id"
            />
            <div
              class="clear w-[16px] mr-2 flex-[16px] flex-grow-0 flex-shrink-0 h-[16px] cursor-pointer"
              @click="clearModel"
              v-if="clearable && String(model).length"
            >
              <svg
                class="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="var(--gray)"
                  d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                />
              </svg>
            </div>
            <slot name="appendText" v-if="appendText">
              <div class="prepend-text mt-0.5 text-sm text">
                {{ appendText }}
              </div>
            </slot>
          </div>
        </div>
        <slot name="append"></slot>
      </VLabel>
    </div>
    <slot name="bottom"></slot>
  </VInput>
</template>

<style scoped lang="scss">
.field {
  transition: all 0.4s;
  input {
    vertical-align: middle;
    background: transparent;
    &::placeholder {
      text-align: left !important;
    }
  }

  .clear {
    opacity: 0;
    transition: all 0.4s;
  }

  &:hover {
    .clear {
      opacity: 1;
    }
  }
}
</style>
