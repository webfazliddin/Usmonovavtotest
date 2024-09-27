<template>
  <div>
    <RouterView></RouterView>
    <CustomNotification />
  </div>
</template>

<script setup lang="ts">
import CustomNotification from "./components/CustomNotification.vue";
import ApiService from "./services/api.service";
import { RouterView } from "vue-router";
import { onMounted } from "vue";

ApiService.setHeader();
onMounted(() => {
});
</script>
<style>
 tr:nth-child(odd) {
  background: rgb(var(--v-theme-oddTableColor));
}

a {
  text-decoration: none;
  outline: none;
  color: inherit;
}
</style>
