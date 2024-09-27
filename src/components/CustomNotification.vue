<script setup lang="ts">
import { watch } from "vue";
import { nextTick, ref } from "vue";
import { AlertCircleIcon, AlertTriangleIcon, CircleCheckIcon } from "vue-tabler-icons";

const animation = {
  enter: {
    opacity: [1, 0],
    translateY: [0, -100]
  },
  leave: {
    opacity: 0
  }
};

const isCollapsed = ref(false);
const textRef = ref<HTMLDivElement | null>(null);
const isReadMore = ref<boolean>(false);
const pauseOnHover = ref<boolean>(false);
const closeOnClick = ref<boolean>(true);
const notificationRefBody = ref<any>();

const close = (prop: any) => {
  if (prop.item.type === "error" || prop.item.type === "warning") {
    return;
  }
  if (!isCollapsed.value) {
    prop.close(prop.item.id);
  }
};

const textLength = async () => {
  await nextTick();
  isCollapsed.value = false;
  if (textRef.value) {
    pauseOnHover.value = false;
    isReadMore.value = false;
    closeOnClick.value = false;

    if (textRef.value.offsetHeight < textRef.value.scrollHeight || textRef.value.offsetWidth < textRef.value.scrollWidth) {
      isReadMore.value = true;
      closeOnClick.value = false;
      pauseOnHover.value = true;
    }
  }

  if (!isCollapsed.value && textRef.value) {
    textRef.value.scrollTo({ top: 0 });
  }
};

watch(
  () => textRef.value,
  () => {
    textLength();
  }
);
</script>

<template>
  <div>
    <notifications
      @start="textLength"
      ref="notificationRefBody"
      position="top center"
      animation-type="velocity"
      dangerously-set-inner-html
      :animation="animation"
      ignoreDuplicates
      :pauseOnHover="closeOnClick"
      :closeOnClick="true"
      :max="4"
    >
      <template #body="props">
        <div :class="[`my-notification`, props.item.type]" @click="close(props)">
          <div class="icon">
            <AlertCircleIcon v-if="props.item.type == 'error'" />
            <CircleCheckIcon v-if="props.item.type == 'success'" />
            <AlertTriangleIcon v-if="props.item.type == 'warn'" />
          </div>
          <div class="content">
            <p class="title" v-if="props.item.title">
              {{ props.item.title }}
            </p>
            <div
              class="text limited-text"
              ref="textRef"
              :class="{
                collapsed: isCollapsed
              }"
              v-html="props.item.text"
            ></div>
            <div class="d-flex justify-space-between">
              <button v-if="isReadMore" @click="isCollapsed = !isCollapsed">{{ isCollapsed ? $t("hide") : $t("show") }}</button>
              <button class="ml-auto" v-if="isReadMore" @click="props.close(props.item.id)">{{ $t("close") }}</button>
            </div>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>

<style lang="scss" scoped>
.vue-notification-group {
  width: 350px !important;
}
.my-notification {
  margin-top: 20px;
  padding: 15px 15px 15px 5px;
  font-size: 16px;
  color: #ffffff;
  background: #44a4fc;
  display: flex;
  white-space: inherit;
  word-break: break-word;
  border-radius: 16px;
  .text {
    max-height: 80vh;
  }
  button {
    margin-top: 20px;
    background: #fff;
    padding: 6px 18px;
    border-radius: 8px;
    border: 2px solid #44a4fc;
    color: #44a4fc;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    transition: all 0.4s;
  }
  .collapsed {
    -webkit-line-clamp: inherit;

    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #fff;
      border-radius: 8px;
    }
  }
  .icon {
    display: flex;
    margin-right: 10px;
  }
  &.success {
    background: #68cd86;
  }

  &.warn {
    background: #ffb648;
  }

  &.error {
    background: #e54d42;
  }
}
</style>
