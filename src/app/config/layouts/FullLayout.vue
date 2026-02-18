<script setup lang="ts">
import { ref } from "vue";
import { useDisplay, useTheme } from "vuetify";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import { useCustomizerStore } from "./store/customizer";

const customizer = useCustomizerStore();
const theme = useTheme();
const { mdAndDown } = useDisplay();

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <v-locale-provider>
    <v-app :theme="theme.global.name.value" class="app-layout">
      <VerticalSidebarVue v-model="sidebarOpen" />
      <VerticalHeaderVue @toggle-sidebar="toggleSidebar" />
      <main class="main-content" :class="{ 'sidebar-open': !mdAndDown }">
        <div class="page-wrapper">
          <div :class="customizer.boxed ? 'maxWidth' : ''">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component"></component>
              </transition>
            </router-view>
          </div>
        </div>
      </main>
    </v-app>
  </v-locale-provider>
</template>

<style scoped lang="scss">
.app-layout {
  background: #f5f5f7 !important;
  min-height: 100vh;
}

.main-content {
  background: transparent !important;
  padding-top: 88px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  &.sidebar-open {
    margin-left: 292px;
  }
}

.page-wrapper {
  padding: 20px 28px 32px;
  max-width: 1920px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
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
    padding: 16px 20px;
  }
}

@media (max-width: 960px) {
  .main-content {
    margin-left: 0 !important;
    padding-top: 84px;
  }

  .page-wrapper {
    padding: 16px 20px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding-top: 76px;
  }

  .page-wrapper {
    padding: 12px;
  }
}
</style>
