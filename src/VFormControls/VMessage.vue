<script setup lang="ts">
interface IProps {
  messages: string[];
}
defineProps<IProps>();
</script>

<template>
  <div class="messages">
    <div class="msg text-[#e23636]" v-for="item in messages">
      {{ item }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
$messages-font-size: 12px !default;
$messages-line-height: 12px !default;
$messages-min-height: 14px !default;
$messages-transition-duration: 150ms !default;
.messages {
  flex: 1 1 0;
  font-size: $messages-font-size;
  min-height: $messages-min-height;
  min-width: 1px; // Ensure takes up space with no messages and inside of flex
  position: relative;
  margin-top: 6px;
}
.msg {
  line-height: $messages-line-height;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;

  transition-duration: $messages-transition-duration;
}
</style>
