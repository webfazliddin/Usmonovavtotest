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
  <v-navigation-drawer
    left
    v-model:model-value="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="80"
    :mobile-breakpoint="960"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
    width="280"
    :class="{ 'is-rail': customizer.mini_sidebar }"
  >
    <div class="sidebar-header">
      <div class="logo-section" @click="router.push('/')">
        <img :src="LogoRu" alt="Logo" class="logo-img" />
        <div class="brand-text" v-show="!customizer.mini_sidebar">
          USMONOV<br>AVTO TEST
        </div>
      </div>
      <v-btn
        class="hidden-md-and-down toggle-btn"
        icon
        variant="text"
        v-show="!customizer.mini_sidebar"
        @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      >
        <CircleDotIcon color="#5c6ec0" size="20" stroke-width="1.5" />
      </v-btn>
    </div>
    <div class="scrollnavbar">
      <v-list class="nav-list py-6 px-4">
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
<style scoped lang="scss">
.leftSidebar {
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08) !important;
  border-right: 1px solid #E8ECF4 !important;
  overflow: hidden !important;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  :deep(.v-navigation-drawer__content) {
    overflow-y: hidden !important;
    overflow-x: hidden !important;
  }
}

.nav-list {
  :deep(.v-list-item) {
    transition: all 0.2s ease;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  border-bottom: 1px solid #E8ECF4;
  min-height: 80px;
  background: #fff;

  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    flex: 1;
    padding: 6px 8px;
    border-radius: 12px;
    transition: all 0.2s ease;
    min-width: 0;

    &:hover {
      background: #F8F9FC;
    }

    .logo-img {
      border-radius: 10px;
      width: 44px;
      height: 44px;
      min-width: 44px;
      object-fit: contain;
      padding: 6px;
      background: #F8F9FC;
      border: 1px solid #E8ECF4;
      transition: all 0.2s ease;
    }

    .brand-text {
      font-family: 'Poppins', sans-serif;
      color: #111827;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.3px;
      opacity: 1;
      transition: opacity 0.2s ease;
      flex: 1;
      min-width: 0;
    }
  }

  .toggle-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    background: #F8F9FC;
    border: 1px solid #E8ECF4;
    border-radius: 8px;
    margin-left: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #4A90E2;
      border-color: #4A90E2;

      :deep(svg) {
        color: #fff !important;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

// Rail mode adjustments
.is-rail {
  .sidebar-header {
    padding: 24px 16px;

    .logo-section {
      justify-content: center;
      padding: 6px;

      .logo-img {
        width: 40px;
        height: 40px;
        min-width: 40px;
      }
    }

    .toggle-btn {
      display: none;
    }
  }

  .scrollnavbar {
    .nav-list {
      padding: 16px 8px !important;
    }
  }
}

.scrollnavbar {
  height: calc(100vh - 80px);
  overflow: hidden !important;

  :deep(.v-list) {
    overflow: hidden !important;
  }
}
</style>