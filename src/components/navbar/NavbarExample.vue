<template>
  <div>
    <AppNavbar
      :links="navLinks"
      :current-path="route.path"
      :badge-count="notificationCount"
      :labels="customLabels"
      :app-name="appName"
      :show-help="true"
      :show-keyboard-shortcuts="true"
      @logout="handleLogout"
      @theme-change="handleThemeChange"
      @language-change="handleLanguageChange"
    />

    <!-- Main Content -->
    <main id="main-content" class="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Welcome to AutoTest
        </h1>
        <p class="text-neutral-700 dark:text-neutral-300">
          This is an example page demonstrating the responsive navbar component.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavbar from './AppNavbar.vue';
import type { NavLink } from './AppNavbar.vue';

const route = useRoute();
const router = useRouter();

// ============================================================================
// State
// ============================================================================

const notificationCount = ref(5);
const appName = ref('AutoTest');

// ============================================================================
// Navigation Links
// ============================================================================

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/tests', label: 'Tests', key: 'tests' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

// ============================================================================
// Custom Labels (i18n)
// ============================================================================

const customLabels = computed(() => ({
  skipToContent: 'Skip to main content',
  menu: 'Open menu',
  closeMenu: 'Close menu',
  language: 'Change language',
  theme: 'Change theme',
  themeLight: 'Light mode',
  themeDark: 'Dark mode',
  themeSystem: 'System preference',
  notifications: 'View notifications',
  profile: 'My Profile',
  settings: 'Settings',
  logout: 'Sign out',
  help: 'Help & Support',
  keyboardShortcuts: 'Keyboard shortcuts',
  navigation: 'Main navigation',
}));

// ============================================================================
// Event Handlers
// ============================================================================

function handleLogout() {
  console.log('Logging out...');
  // Implement logout logic:
  // - Clear authentication tokens
  // - Clear user session
  // - Redirect to login page
  // router.push('/login');
}

function handleThemeChange(theme: 'light' | 'dark' | 'system') {
  console.log('Theme changed to:', theme);
  // Additional logic:
  // - Track analytics
  // - Save to user preferences API
}

function handleLanguageChange(language: 'uz' | 'ru' | 'en') {
  console.log('Language changed to:', language);
  // Implement i18n logic:
  // - Update app locale
  // - Refetch content in new language
  // - Save to user profile
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
