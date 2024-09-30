<script setup lang="ts">
import { useRoute } from "vue-router";
import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import { useCustomizerStore } from "./store/customizer";
import { useTheme } from "vuetify";

const customizer = useCustomizerStore();
const theme = useTheme();
const route = useRoute();
</script>

<template>
  <v-locale-provider>
    <v-app :theme="theme.global.name.value">
      <VerticalSidebarVue />
      <VerticalHeaderVue />
      <v-main class="mt-5">
        <v-container fluid class="page-wrapper mt-6 pb-sm-15 pb-10">
          <div :class="customizer.boxed ? 'maxWidth' : ''">
            <BaseBreadcrumb
              v-if="route.meta.pageTitle || route.meta.breadcrumbs"
              :title="$t(route.meta.pageTitle as string)"
              :breadcrumbs="route.meta.breadcrumbs"
            />
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component"></component>
              </transition>
            </router-view>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
