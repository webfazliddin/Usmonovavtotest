<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import navMenu from "@/app/config/permissions/index";
import { useTheme } from "vuetify";
import { UserIcon, LogoutIcon, LanguageIcon } from "vue-tabler-icons";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { loadLocaleMessages } from "@/app/config/i18n";

const router = useRouter();
const theme = useTheme();
const { locale } = useI18n();
const valueIn = ref(false);
const profileMenuOpen = ref(false);
const languageMenuOpen = ref(false);

// Language options
const languages = [
  { code: 'uz-latn', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'uz-cyrl', label: 'Ўзбекча', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

// Current language
const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0];
});

// Get all visible nav items
const navItems = computed(() => {
  const items: any[] = [];
  navMenu.value.forEach((group) => {
    if (group.children) {
      group.children.forEach((child) => {
        if (child.visible) {
          items.push(child);
        }
      });
    }
  });
  return items;
});

// Change language
const changeLanguage = async (langCode: string) => {
  locale.value = langCode;
  localStorage.setItem('lang', langCode);
  await loadLocaleMessages(langCode);
  languageMenuOpen.value = false;
};

// Logout function
const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout');
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    // Clear session storage
    sessionStorage.clear();
    // Redirect to login
    router.replace('/sign-in');
  } catch (error) {
    console.error('Logout error:', error);
    // Even if API fails, clear local data and redirect
    localStorage.clear();
    sessionStorage.clear();
    router.replace('/sign-in');
  }
};

watch(
  () => valueIn.value,
  () => {
    theme.global.name.value = theme.global.current.value.dark
      ? "ORANGE_THEME"
      : "DARK_RED_THEME";
  }
);
</script>

<template>
  <header class="modern-header">
    <div class="header-content">
      <!-- Logo -->
      <div class="brand" @click="router.push('/')">
        <img src="@/assets/images/logoMain.png" alt="Logo" />
        <div class="brand-text">
          <div class="brand-name">USMONOV</div>
          <div class="brand-subtitle">Avto Test</div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-main">
        <a
          v-for="item in navItems"
          :key="item.to"
          class="nav-link"
          :class="{ active: $route.path === item.to }"
          @click="router.push(item.to)"
        >
          {{ $t(item.title) }}
        </a>
      </nav>

      <!-- Actions -->
      <div class="header-actions">
        <!-- Language Menu -->
        <v-menu v-model="languageMenuOpen" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn class="language-btn" icon v-bind="props">
              <LanguageIcon :size="22" />
            </v-btn>
          </template>
          <v-list class="language-list">
            <v-list-item
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="language-item"
              :class="{ active: locale === lang.code }"
            >
              <template v-slot:prepend>
                <span class="language-flag">{{ lang.flag }}</span>
              </template>
              <v-list-item-title>{{ lang.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Profile Menu -->
        <v-menu v-model="profileMenuOpen" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn class="profile-btn" icon v-bind="props">
              <UserIcon :size="22" />
            </v-btn>
          </template>
          <v-list class="profile-list">
            <v-list-item @click="handleLogout" class="logout-item">
              <template v-slot:prepend>
                <LogoutIcon :size="20" />
              </template>
              <v-list-item-title>Chiqish</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.modern-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(135deg, rgba(252, 253, 255, 0.98) 0%, rgba(248, 251, 255, 0.98) 50%, rgba(250, 252, 255, 0.98) 100%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(230, 240, 253, 0.8);
  box-shadow: 0 2px 12px rgba(93, 135, 255, 0.06);
  z-index: 1100;
}

.header-content {
  max-width: 1920px;
  margin: 0 auto;
  height: 100%;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 48px;

  @media (max-width: 1280px) {
    padding: 0 24px;
    gap: 32px;
  }

  @media (max-width: 960px) {
    gap: 24px;
  }
}

// Brand/Logo
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .brand-name {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.5px;
  }

  .brand-subtitle {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    font-family: 'Poppins', sans-serif;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .brand-name {
      font-size: 18px;
    }

    .brand-subtitle {
      font-size: 11px;
    }
  }

  @media (max-width: 600px) {
    .brand-text {
      display: none;
    }
  }
}

// Navigation
.nav-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;

  @media (max-width: 960px) {
    display: none;
  }
}

.nav-link {
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  position: relative;

  &:hover {
    color: #5d87ff;
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.08) 0%, rgba(93, 135, 255, 0.12) 100%);
    transform: translateY(-1px);
  }

  &.active {
    color: #5d87ff;
    font-weight: 600;
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.12) 0%, rgba(93, 135, 255, 0.18) 100%);
    box-shadow: 0 2px 8px rgba(93, 135, 255, 0.15);
  }
}

// Header Actions
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Language Button
.language-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.08) 0%, rgba(93, 135, 255, 0.12) 100%);
    color: #5d87ff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
}

.language-list {
  min-width: 180px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(93, 135, 255, 0.1);
  border: 1px solid rgba(230, 240, 253, 0.6);
}

.language-item {
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 0;

  &:hover {
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.08) 0%, rgba(93, 135, 255, 0.12) 100%);
    transform: translateX(2px);
  }

  &.active {
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.15) 0%, rgba(93, 135, 255, 0.2) 100%);
    color: #5d87ff;
    font-weight: 600;
  }
}

.language-flag {
  font-size: 20px;
  line-height: 1;
}

// Profile Button
.profile-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(93, 135, 255, 0.08) 0%, rgba(93, 135, 255, 0.12) 100%);
    color: #5d87ff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
}

.profile-list {
  min-width: 160px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(93, 135, 255, 0.1);
  border: 1px solid rgba(230, 240, 253, 0.6);
}

.logout-item {
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 0;

  &:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.12) 100%);
    color: #ef4444;
    transform: translateX(2px);
  }
}
</style>
