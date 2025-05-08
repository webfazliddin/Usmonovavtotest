<script setup lang="ts">
import LogoRu from "@/assets/images/logoMain.png";
import navMenu from "@/app/config/permissions/index";
import { CircleDotIcon, CircleIcon } from "vue-tabler-icons";
import NavItem from "./NavItem/index.vue";
import NavGroup from "./NavGroup/index.vue";
import { useCustomizerStore } from "../store/customizer";
import { useRouter } from "vue-router";

const customizer = useCustomizerStore();
const router = useRouter();
</script>

<template>
  <v-navigation-drawer left v-model:model-value="customizer.Sidebar_drawer" elevation="0" rail-width="75"
    :mobile-breakpoint="960" app class="leftSidebar" :rail="customizer.mini_sidebar" expand-on-hover width="256">
    <div class="pa-5 pl-4" style="display: flex; align-items: center; cursor: pointer" @click="router.push('/')">
      <div class="d-flex align-center justify-between">
        <div> <img :src="LogoRu" width="50" alt="" /></div><div class="ml-5 nunito">USMONOV AVTO TEST</div>
      </div>
      <v-btn class="hidden-md-and-down ml-auto" icon color="primary" variant="text"
        @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)">
        <v-tooltip activator="parent" location="top">
          {{ customizer.mini_sidebar ? $t("fullMenu") : $t("collapseMenu") }}
        </v-tooltip>
        <CircleDotIcon color="rgb(var(--v-theme-primary))" v-if="!customizer.mini_sidebar" />
        <CircleIcon color="rgb(var(--v-theme-primary))" v-else />
      </v-btn>
    </div>
    <div class="scrollnavbar">
      <v-list class="py-6 px-4">
        <template v-for="(item, _) in navMenu">
          <NavGroup :item="item"></NavGroup>
          <template v-for="child in item?.children">
            <NavItem :item="child" class="leftPadding" v-if="child.visible" />
          </template>
        </template>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
.nunito{
  font-family: "Nunito", sans-serif;
  color: #242424;
  font-size: 20px;
}
</style>