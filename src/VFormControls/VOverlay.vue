<script setup lang="ts">
import { useClickOutside } from "@/composables/useClickOutSide";
import { onBeforeUnmount, ref, watch } from "vue";
import { useProxiedModel } from "./composables/proxieModel";
import type { EventProp } from "./util";

interface IProps {
  modelValue?: boolean;
  outside?: boolean;
  "onUpdate:modelValue"?: EventProp<[boolean | null]> | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  outside: true,
  modelValue: true
});

const model = useProxiedModel(props, "modelValue");

const emits = defineEmits(["update:model-value"]);

const isShowParent = ref(false);
const isShow = ref(false);
const isSottedPosition = ref(false);
let timer: ReturnType<typeof setTimeout>;
let model_timer: ReturnType<typeof setTimeout>;

const overlay = ref<HTMLElement | null>(null);

const setVhProperty = () => {
  if (overlay.value) {
    const vh = window.innerHeight * 0.01;
    overlay.value.style.setProperty("--vh", `${vh}px`);
  }
};

const disableScroll = () => {
  // To get the scroll position of current webpage
  let TopScroll = window.pageYOffset || document.documentElement.scrollTop;
  let LeftScroll = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(LeftScroll, TopScroll);
  };

  if (!model.value) {
    enableScroll();
  }
};

const enableScroll = () => {
  window.onscroll = function () {};
};

const showDialog = () => {
  isShowParent.value = true;
  isSottedPosition.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    isShow.value = true;
    setVhProperty();
    window.addEventListener("resize", setVhProperty);
    disableScroll();
  }, 0);
};

const closeDialog = () => {
  isShow.value = false;

  enableScroll();
  if (model_timer) clearTimeout(model_timer);
  model_timer = setTimeout(() => {
    isShowParent.value = false;
    emits("update:model-value", false);
    window.removeEventListener("resize", setVhProperty);
  }, 200);
};

useClickOutside(overlay, () => {
  if (props.outside) {
    // emits("update:model-value", false);
    model.value = false;
  }
});

watch(
  () => model.value,
  (val) => {
    setTimeout(() => {
      if (val) {
        showDialog();
      } else {
        closeDialog();
        enableScroll();
      }
    }, 0);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  enableScroll();
});
</script>

<template>
  <Transition name="fade">
    <div class="v-overlay" v-if="isShowParent">
      <div ref="overlay" class="overlay">
        <slot :isSottedPosition="isSottedPosition" :isShow="isShow"></slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.v-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 1002;
  transition: all 0.4s;

  .overlay {
    max-height: 80vh;
    max-height: calc(var(--vh, 1vh) * 100);
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    will-change: scroll-position;
  }
}
</style>
