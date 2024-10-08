<script setup lang="ts">
import { toRefs } from "vue";
import VLoader from "./VLoader.vue";

interface IProps {
  variant?: string;
  color?: string;
  block?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean | undefined;
  loaderColor?: string;
  size?: "sm" | "md";
}
const props = withDefaults(defineProps<IProps>(), {
  type: "button",
  color: "primary-default",
  loaderColor: "white",
  loading: false,
  size: "md",
});
toRefs(props);
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    v-bind="$attrs"
    :class="[
      'rounded-lg w-fit flex items-center justify-center h-fit sm:text-base text-sm shadow-sm disabled:opacity-80 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
      block ? 'w-full' : 'w-auto',
      props.variant == 'outline'
        ? `bg-transparent text-${props.color} border-1 outlined`
        : `${`bg-rpiamry-default !text-white`} `,
      {
        'lg:px-4 py-1.5 px-2': size === 'sm',
        'lg:px-3.5 py-2.5 px-2': size === 'md',
      },
    ]"
  >
    <!-- props.color == 'danger-default' ? 'bg-danger-default' :  -->
    <div v-if="loading" class="flex items-center h-fit text-sm">
      <VLoader width="23" :color="loaderColor"></VLoader>
    </div>
    <slot v-if="!loading" />
  </button>
</template>

<style scoped>
button {
  transition: 0.5s ease;
  outline: none;
}
.outlined {
  border: 1px solid;
  transition: 0.5s ease;
}

.outlined:hover {
  color: white;
  background-color: #659961;
  transition: 0.5s ease;
}
.bg-gray {
  background-color: var(--gray);
}
</style>
