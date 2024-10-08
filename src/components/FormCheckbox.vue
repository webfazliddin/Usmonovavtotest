<script setup lang="ts">
import { computed } from "vue";
interface IProps {
  switchBox?: boolean;
  label?: string | null;
  modelValue?: any;
  attr?: any;
  activeColor?: string;
  id?: any;
}
const props = withDefaults(defineProps<IProps>(), {
  label: "",
  id: "one"
});

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const updateVal = computed({
  get() {
    return props.modelValue;
  },
  set(newVal): void {
    emits("update:modelValue", newVal);
  }
});
</script>

<template>
  <div v-if="switchBox" class="custom-switch -ml-3">
    <label>
      <input type="checkbox" v-bind="$attrs" v-model="updateVal" />
      <span class="toggle_background" :style="`--bg: ${activeColor?.length ? activeColor : 'var(--primary)'}`"></span>
    </label>
  </div>
  <div class="custom-checkbox" v-if="!switchBox">
    <input type="checkbox" :id="id" v-bind="$attrs" v-model="updateVal" />
    <label :for="id" class="text-sm">
      <span></span> <slot name="label">{{ label }}</slot>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.custom-switch {
  display: block;
  label {
    display: flex;
    align-items: center;
  }

  input {
    opacity: 0;
    position: absolute;
  }

  input:checked ~ span {
    box-shadow: 0px 3px 1px 0px #0000000f;
    box-shadow: 0px 3px 8px 0px #00000026;
    background: var(--bg);
  }

  input:checked ~ span:after {
    left: 1.25rem;
    background: whitesmoke;
  }

  input:checked ~ span:active::after {
    left: 1.0625rem;
    background: whitesmoke;
  }

  input:not(:checked) ~ span:active::after {
    background: rgb(248, 248, 248);
  }

  .toggle_background {
    display: flex;
    align-items: center;
    width: 2.875rem;
    height: 1.75rem;
    position: relative;
    cursor: pointer;
    background-color: #78788029;
    border-radius: 2em;
    border: 0.125rem transparent solid;
    transition: all 0.3s;
  }

  .toggle_background::after {
    content: "";
    display: flex;
    position: absolute;
    width: 1.375rem;
    height: 1.375rem;
    left: 0.125rem;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 3.125rem;
    background: #f0f5f9;
    transition: all 0.3s;
    // box-shadow: 0.125rem 0.125rem 0.3125rem rgba(110, 110, 110, 0.253);
  }

  span:active:after {
    width: 70%;
  }

  .circle-icon {
    position: absolute;
    right: 15%;
    border: solid 0.125rem rgb(95, 95, 95);
    border-radius: 50%;
    width: 0.3125rem;
    height: 0.3125rem;
  }

  .vertical_line {
    position: absolute;
    left: 22%;
    background: rgb(241, 241, 241);
    width: 0.125rem;
    height: 0.5rem;
  }
}

.custom-checkbox {
  display: flex;
  align-items: center;
  height: auto;

  label {
    display: flex;
    align-items: center;
    color: #9e9e9e;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
    position: absolute;
  }

  label > span {
    width: 1.125rem;
    height: 1.125rem;
    display: flex;
    justify-content: center;
    border: 0.125rem solid #9e9e9e;
    margin-right: 0.75rem;
    border-radius: 0.1875rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  input:checked + label > span {
    border: 0.625rem solid var(--secondary-dark);
    animation: bounce 250ms;
    position: relative;
  }

  input:checked + label > span::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    transform-origin: 50% 20%;
    border-right: 0.1875rem solid transparent;
    border-bottom: 0.1875rem solid transparent;
    animation: checked-box 125ms 250ms forwards;
  }

  @keyframes checked-box {
    0% {
      width: 0;
      height: 0;
      border-color: #fff;
      transform: translate(0, 0) rotate(45deg);
    }

    33% {
      width: 0rem;
      height: 0;
      border-color: #fff;
      transform: translate(0, 2px) rotate(45deg);
    }

    100% {
      width: 0.375rem;
      height: 0.625rem;
      border-color: var(--white);
      transform: translate(0px, -0.25rem) rotate(45deg);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1);
    }

    33% {
      transform: scale(0.7);
    }

    100% {
      transform: scale(1);
    }
  }
}
</style>
