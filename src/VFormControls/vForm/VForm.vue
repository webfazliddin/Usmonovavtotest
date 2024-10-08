<script setup lang="ts">
import { ref } from "vue";
import { createForm, type SubmitEventPromise } from "../composables/useForm";

const props = defineProps();

const form = createForm(
  //@ts-ignore
  props
);

const formRef = ref<HTMLFormElement>();
const emits = defineEmits(["submit", "update:modelValue"]);

function onSubmit(_e: Event) {
  const e = _e as SubmitEventPromise;

  const ready = form.validate();
  e.then = ready.then.bind(ready);
  e.catch = ready.catch.bind(ready);
  e.finally = ready.finally.bind(ready);

  emits("submit", e);

  if (!e.defaultPrevented) {
    // @ts-ignore
    ready.then(({ valid }) => {
      if (valid) {
        formRef.value?.submit();
      }
    });
  }

  e.preventDefault();
}

defineExpose({
  formRef,
  form: form,
  onSubmit
});
</script>

<template>
  <form @submit.prevent="onSubmit" ref="formRef">
    <slot></slot>
  </form>
</template>

<style lang="scss" scoped></style>
