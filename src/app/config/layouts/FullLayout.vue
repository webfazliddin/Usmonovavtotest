<script setup lang="ts">
import { useRoute } from "vue-router";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import { useCustomizerStore } from "./store/customizer";
import { useTheme } from "vuetify";

const customizer = useCustomizerStore();
const theme = useTheme();
const route = useRoute();
</script>

<template>
  <v-locale-provider>
    <v-app :theme="theme.global.name.value" class="app-layout">
      <VerticalHeaderVue />
      <v-main class="main-content">
        <v-container fluid class="page-wrapper">
          <div :class="customizer.boxed ? 'maxWidth' : ''">
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

<style scoped lang="scss">
.app-layout {
  background: linear-gradient(135deg, #f0f4ff 0%, #e6f0fd 50%, #f5f8ff 100%) !important;
  min-height: 100vh;
}

.main-content {
  background: transparent !important;
  padding-top: 94px !important;
  position: relative;
  min-height: 100vh;
  transition: padding-top 0.3s ease;
}

.page-wrapper {
  padding: 0 32px 32px;
  max-width: 1920px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  transition: padding 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .page-wrapper {
    padding: 24px;
  }
}

@media (max-width: 960px) {
  .page-wrapper {
    padding: 20px 24px;
  }
}

@media (max-width: 600px) {
  .page-wrapper {
    padding: 16px 20px;
  }
}

@media (max-width: 375px) {
  .page-wrapper {
    padding: 16px;
  }
}
</style>
