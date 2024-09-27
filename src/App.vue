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
a {
  text-decoration: none;
  outline: none;
  color: inherit;
}

body{
  background-color: rgb(var(--v-theme-background));
}
</style>
