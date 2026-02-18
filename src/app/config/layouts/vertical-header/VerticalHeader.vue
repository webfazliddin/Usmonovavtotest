<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { UserIcon, LogoutIcon, MenuIcon } from "vue-tabler-icons";
import LogoRu from "@/assets/images/logoMain.png";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { loadLocaleMessages } from "@/app/config/i18n";

const emit = defineEmits<{
  (e: "toggle-sidebar"): void;
}>();

const router = useRouter();
const { locale } = useI18n();
const profileMenuOpen = ref(false);
const languageMenuOpen = ref(false);

// Language options
const languages = [
  { code: "uz-latn", label: "O'zbekcha", flag: "\u{1F1FA}\u{1F1FF}" },
  { code: "uz-cyrl", label: "\u040E\u0437\u0431\u0435\u043A\u0447\u0430", flag: "\u{1F1FA}\u{1F1FF}" },
  { code: "ru", label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", flag: "\u{1F1F7}\u{1F1FA}" },
];

// Current language
const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === locale.value) || languages[0];
});

// Change language
const changeLanguage = async (langCode: string) => {
  locale.value = langCode;
  localStorage.setItem("lang", langCode);
  await loadLocaleMessages(langCode);
  languageMenuOpen.value = false;
};

// Logout function
const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    sessionStorage.clear();
    router.replace("/sign-in");
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/sign-in");
  }
};
</script>

<template>
  <header class="top-header">
    <div class="header-content">
      <!-- Left: Logo + Mobile toggle -->
      <div class="header-left">
        <button class="sidebar-toggle" @click="emit('toggle-sidebar')">
          <MenuIcon :size="20" />
        </button>
        <div class="logo-section" @click="router.push('/')">
          <div class="logo-icon-wrap">
            <img :src="LogoRu" alt="Logo" class="logo-img" />
          </div>
          <div class="brand-text">
            <span class="brand-name">USMONOV</span>
            <span class="brand-subtitle">Avto Test</span>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="header-right">
        <!-- Language Menu -->
        <v-menu v-model="languageMenuOpen" offset-y>
          <template v-slot:activator="{ props }">
            <button class="header-btn" v-bind="props">
              <span class="lang-flag">{{ currentLanguage.flag }}</span>
              <span class="lang-label">{{ currentLanguage.label }}</span>
            </button>
          </template>
          <v-list class="dropdown-list">
            <v-list-item
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="dropdown-item"
              :class="{ active: locale === lang.code }"
            >
              <template v-slot:prepend>
                <span class="lang-flag">{{ lang.flag }}</span>
              </template>
              <v-list-item-title>{{ lang.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Profile Menu -->
        <v-menu v-model="profileMenuOpen" offset-y>
          <template v-slot:activator="{ props }">
            <button class="profile-trigger" v-bind="props">
              <div class="avatar">
                <UserIcon :size="17" />
              </div>
            </button>
          </template>
          <v-list class="dropdown-list">
            <v-list-item @click="handleLogout" class="dropdown-item logout-item">
              <template v-slot:prepend>
                <LogoutIcon :size="18" />
              </template>
              <v-list-item-title>{{ $t("Logout") }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-header {
  position: fixed;
  top: 16px;
  right: 16px;
  left: calc(260px + 16px + 16px);
  height: 56px;
  background: #ffffff;
  border-radius: 16px;
  z-index: 1100;
  transition: left 0.3s ease;

  @media (max-width: 960px) {
    left: 16px;
  }

  @media (max-width: 600px) {
    top: 12px;
    left: 12px;
    right: 12px;
    height: 52px;
    border-radius: 14px;
  }
}

.header-content {
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    padding: 0 14px;
  }
}

// Left section
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 10px;
}

.logo-icon-wrap {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;

  @media (max-width: 600px) {
    display: none;
  }
}

.brand-name {
  font-size: 14px;
  font-weight: 700;
  color: #1F2937;
  font-family: "Poppins", sans-serif;
  letter-spacing: 0.3px;
}

.brand-subtitle {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  font-family: "Poppins", sans-serif;
  margin-top: 2px;
}

.sidebar-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: #f9fafb;
  color: #6B7280;
  cursor: pointer;

  @media (max-width: 960px) {
    display: flex;
  }
}

// Right section
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  background: #f9fafb;
  color: #1F2937;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
}

.lang-flag {
  font-size: 18px;
  line-height: 1;
}

.lang-label {
  @media (max-width: 600px) {
    display: none;
  }
}

.profile-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #5D87FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

// Dropdown styles
.dropdown-list {
  min-width: 180px;
  padding: 6px !important;
  background: #ffffff !important;
  border-radius: 14px !important;
  box-shadow: none !important;
}

.dropdown-item {
  border-radius: 8px !important;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  min-height: 40px !important;
  margin: 2px 0;
  color: #1F2937;

  &.active {
    background: #F9FAFB !important;
    color: #1F2937;
    font-weight: 600;
  }
}

.logout-item {
  color: #1F2937;
}
</style>
