<script setup lang="ts">
import { RouterView } from "vue-router";
import { watch } from "vue";
import ApiService from "./services/api.service";
import { useGlobalStore } from "./stores/globalStore";

ApiService.setHeader();
const store = useGlobalStore();
// watch(
//   () => store.theme,
//   (newTheme) => {
//     typeof document !== "undefined" &&
//       document.querySelector("html")?.setAttribute("data-theme", newTheme);
//     typeof localStorage !== "undefined" &&
//       localStorage.setItem("theme", newTheme);
//   },
//   { immediate: true }
// );
</script>

<template>
  <RouterView></RouterView>
  <!-- <CustomNotification /> -->
</template>

<style>
/* @import "@/app/styles/index.scss"; */
</style>
