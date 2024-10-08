<script setup lang="ts">
import { ref } from "vue";
import { CheckIcon, LayoutDistributeHorizontalIcon, LayoutDistributeVerticalIcon, LayoutSidebarLeftCollapseIcon } from "vue-tabler-icons";
import { useCustomizerStore } from "./store/customizer";

const customizer = useCustomizerStore();

// themes color options
const themeColors = ref([
  {
    name: "ORANGE_THEME",
    bg: "themeOrange"
  },
  {
    name: "BLUE_THEME",
    bg: "themeBlue"
  },
  {
    name: "RED_THEME",
    bg: "themeRed"
  },
  {
    name: "PURPLE_THEME",
    bg: "themePurple"
  },
  {
    name: "GREEN_THEME",
    bg: "themeGreen"
  },
  {
    name: "INDIGO_THEME",
    bg: "themeIndigo"
  }
]);

// Dark Theme Colors
const DarkthemeColors = ref([
  { name: "DARK_ORANGE_THEME", bg: "themeDarkOrange" },
  { name: "DARK_BLUE_THEME", bg: "themeDarkBlue" },
  { name: "DARK_RED_THEME", bg: "themeDarkRed" },
  { name: "DARK_PURPLE_THEME", bg: "themeDarkPurple" },
  { name: "DARK_GREEN_THEME", bg: "themeDarkGreen" },
  { name: "DARK_INDIGO_THEME", bg: "themeDarkIndigo" }
]);
</script>
<template>
  <div class="pa-6">
    <h5 class="text-h5">Settings</h5>
  </div>
  <v-divider></v-divider>
  <div style="height: calc(100vh - 90px)">
    <div class="pa-6">
      <h6 class="text-h6 mt-8 mb-5">Theme Color</h6>
      <v-item-group mandatory v-model="customizer.actTheme" class="ml-n2 v-row">
        <v-col cols="4" v-for="theme in themeColors" :key="theme.name" class="pa-2">
          <v-item v-slot="{ isSelected, toggle }" :value="theme.name">
            <v-sheet rounded="md" class="border cursor-pointer d-block text-center px-5 py-4 hover-btns" elevation="9" @click="toggle">
              <v-avatar :class="theme.bg" size="25">
                <CheckIcon color="white" size="18" v-if="isSelected" />
              </v-avatar>
            </v-sheet>
          </v-item>
        </v-col>
      </v-item-group>
      <h6 class="text-h6 mt-11 mb-5">Theme Dark Color</h6>
      <v-item-group mandatory v-model="customizer.actTheme" class="ml-n2 v-row">
        <v-col cols="4" v-for="theme in DarkthemeColors" :key="theme.name" class="pa-2">
          <v-item v-slot="{ isSelected, toggle }" :value="theme.name">
            <v-sheet rounded="md" class="border cursor-pointer d-block text-center px-5 py-4 hover-btns" elevation="9" @click="toggle">
              <v-avatar :class="theme.bg" size="25">
                <CheckIcon color="white" size="18" v-if="isSelected" />
              </v-avatar>
            </v-sheet>
          </v-item>
        </v-col>
      </v-item-group>
      <h6 class="text-h6 mt-11 mb-2">Container Option</h6>
      <v-btn-toggle v-model="customizer.boxed" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
        <v-btn :value="true" variant="text" elevation="9" class="rounded-md">
          <LayoutDistributeVerticalIcon stroke-width="1.5" size="21" class="mr-2" />
          Boxed
        </v-btn>
        <v-btn :value="false" variant="text" elevation="9" class="rounded-md">
          <LayoutDistributeHorizontalIcon stroke-width="1.5" size="21" class="mr-2" />
          Full
        </v-btn>
      </v-btn-toggle>
      <!---Horizontal demo hide this option --->
      <v-sheet v-if="customizer.setHorizontalLayout != true">
        <h6 class="text-h6 mt-11 mb-2">Sidebar Type</h6>
        <v-btn-toggle v-model="customizer.mini_sidebar" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
          <v-btn :value="false" variant="text" elevation="9" class="rounded-md">
            <LayoutSidebarIcon stroke-width="1.5" size="21" class="mr-2" />
            Full
          </v-btn>
          <v-btn :value="true" variant="text" elevation="9" class="rounded-md">
            <LayoutSidebarLeftCollapseIcon stroke-width="1.5" size="21" class="mr-2" />
            Collapse
          </v-btn>
        </v-btn-toggle>
      </v-sheet>
      <h6 class="text-h6 mt-11 mb-2">Card with</h6>
      <v-btn-toggle v-model="customizer.setBorderCard" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
        <v-btn :value="false" variant="text" elevation="9" class="rounded-md">
          <LayoutSidebarLeftCollapseIcon stroke-width="1.5" size="21" class="mr-2" />
          Shadow
        </v-btn>
        <v-btn :value="true" variant="text" elevation="9" class="rounded-md">
          <LayoutSidebarIcon stroke-width="1.5" size="21" class="mr-2" />
          Border
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>
<style lang="scss"></style>
