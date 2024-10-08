<script setup lang="ts">
import { useRoute } from "vue-router";
import HeaderVue from "./Header/HeaderVue.vue";
import SideBar from "./Sidebar/SideBar.vue";
import BackButton from "@/components/BackButton.vue";
import { useNavigation } from "@/utils/navigation";
import FooterVue from "./Footer/FooterVue.vue";
import { useAuth } from "@/stores/auth";
import VOverlay from "@/components/VOverlay.vue";
import VLoader from "@/components/VLoader.vue";
import VTransition from "@/components/VTransition.vue";

const route = useRoute();
const authStore = useAuth();
const { hasBack } = useNavigation();
</script>

<template>
  <div class="layout">
    <VOverlay v-model:model-value="authStore.authLoading" class="wrapper">
      <VLoader width="64"> </VLoader>
    </VOverlay>
    <SideBar v-if="!route.meta.hideSidebar" id="sidebar" />

    <main class="main" id="main">
      <div class="page">
        <HeaderVue v-if="!route.meta.hideHeader" />
        <div class="overflow-hidden">
          <VTransition name="slide-up" origin="center" absolute>
            <BackButton v-if="hasBack() && !route.meta.hideBack" />
          </VTransition>
          <router-view v-slot="{ Component, route }">
            <Transition
              :name="route.meta.transition as string || 'fade'"
              mode="out-in"
            >
              <component :is="Component"></component>
            </Transition>
          </router-view>
        </div>
      </div>
      <FooterVue class="page-padding-x" />
    </main>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
