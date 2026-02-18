<script setup lang="ts">
import navMenu from "@/app/config/permissions/index";
import NavItem from "./NavItem/index.vue";
import NavGroup from "./NavGroup/index.vue";
import { useRouter } from "vue-router";
import { watch } from "vue";
import { useDisplay } from "vuetify";
import { XIcon, LogoutIcon } from "vue-tabler-icons";
import axios from "axios";

const router = useRouter();
const { mdAndDown } = useDisplay();

const sidebarOpen = defineModel<boolean>("modelValue", { default: true });

const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout");
  } catch {
    // ignore
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAdmin");
  sessionStorage.clear();
  router.replace("/sign-in");
};

// Close sidebar on mobile when navigating
watch(
  () => router.currentRoute.value.path,
  () => {
    if (mdAndDown.value) {
      sidebarOpen.value = false;
    }
  }
);
</script>

<template>
  <!-- Mobile overlay -->
  <Transition name="fade">
    <div
      v-if="sidebarOpen && mdAndDown"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    />
  </Transition>

  <aside
    class="dashboard-sidebar"
    :class="{ open: sidebarOpen, 'is-mobile': mdAndDown }"
  >
    <!-- Mobile close button -->
    <div v-if="mdAndDown" class="sidebar-mobile-header">
      <button class="close-btn" @click="sidebarOpen = false">
        <XIcon :size="18" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <v-list class="nav-list">
        <template v-for="(group, i) in navMenu" :key="i">
          <NavGroup :item="group" />
          <template v-for="child in group?.children" :key="child.to">
            <NavItem :item="child" v-if="child.visible" />
          </template>
        </template>
      </v-list>
    </nav>

    <!-- Logout Button -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout">
        <LogoutIcon :size="20" />
        <span>{{ $t("Logout") }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.dashboard-sidebar {
  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: 260px;
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1200;
  transition: transform 0.3s ease;
  overflow: hidden;

  &.is-mobile {
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 0 20px 20px 0;
    transform: translateX(-110%);

    &.open {
      transform: translateX(0);
      box-shadow: none;
    }
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1199;
}

// Mobile header
.sidebar-mobile-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 16px 8px;
  flex-shrink: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: #F9FAFB;
  color: #9CA3AF;
  cursor: pointer;
}

// Navigation
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0 16px;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 3px;
  }
}

.nav-list {
  padding: 0 14px !important;
  background: transparent !important;
}

// Logout footer
.sidebar-footer {
  flex-shrink: 0;
  padding: 12px 14px 16px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: #f9fafb;
  color: #EF4444;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #FEE2E2;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
