<template>
  <div>
    <!-- Skip to content link -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-800 dark:text-neutral-100"
    >
      {{ labels.skipToContent }}
    </a>

    <!-- Header -->
    <header
      class="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 shadow-sm backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-900/80 transition-colors duration-200"
    >
      <nav
        class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 lg:h-16"
        aria-label="Main navigation"
      >
        <!-- Left: Logo + Product Name + Mobile Menu -->
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Button -->
          <button
            type="button"
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200 lg:hidden"
            :aria-label="mobileMenuOpen ? labels.closeMenu : labels.menu"
            :aria-expanded="mobileMenuOpen"
          >
            <component :is="mobileMenuOpen ? XIcon : MenuIcon" :size="22" />
          </button>

          <!-- Logo -->
          <router-link
            to="/"
            class="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg
              class="h-8 w-8 text-blue-600 dark:text-blue-500"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="6" fill="currentColor" />
              <path
                d="M16 8L24 12V20L16 24L8 20V12L16 8Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {{ appName }}
            </span>
          </router-link>
        </div>

        <!-- Center: Desktop Navigation -->
        <div class="hidden flex-1 items-center justify-center lg:flex">
          <div class="flex items-center gap-1">
            <router-link
              v-for="link in links"
              :key="link.key"
              :to="link.href"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
              ]"
              :aria-current="isActive(link.href) ? 'page' : undefined"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2" aria-label="User actions">
          <!-- Language Switcher -->
          <div class="relative" ref="languageDropdownRef">
            <button
              type="button"
              @click="toggleLanguageMenu"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
              :aria-label="labels.language"
              :aria-expanded="languageMenuOpen"
            >
              <GlobeIcon :size="20" />
              <span class="hidden sm:inline">{{ currentLanguageLabel }}</span>
              <ChevronDownIcon
                :size="16"
                :class="['transition-transform', languageMenuOpen && 'rotate-180']"
              />
            </button>

            <!-- Language Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="languageMenuOpen"
                class="absolute right-0 top-full mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 motion-reduce:transition-none"
                role="menu"
                :aria-label="labels.language"
              >
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  @click="handleLanguageChange(lang.code)"
                  :class="[
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                    currentLanguage === lang.code
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-neutral-700 dark:text-neutral-300'
                  ]"
                  role="menuitem"
                >
                  <span class="text-lg">{{ lang.flag }}</span>
                  <span class="flex-1 text-left">{{ lang.label }}</span>
                  <CheckIcon v-if="currentLanguage === lang.code" :size="16" />
                </button>
              </div>
            </transition>
          </div>

          <!-- Theme Toggle -->
          <div class="relative" ref="themeDropdownRef">
            <button
              type="button"
              @click="toggleThemeMenu"
              class="flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
              :aria-label="labels.theme"
              :aria-expanded="themeMenuOpen"
            >
              <component :is="currentThemeIcon" :size="20" />
            </button>

            <!-- Theme Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="themeMenuOpen"
                class="absolute right-0 top-full mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 motion-reduce:transition-none"
                role="menu"
                :aria-label="labels.theme"
              >
                <button
                  v-for="theme in themes"
                  :key="theme.value"
                  type="button"
                  @click="handleThemeChange(theme.value)"
                  :class="[
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                    currentTheme === theme.value
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-neutral-700 dark:text-neutral-300'
                  ]"
                  role="menuitem"
                >
                  <component :is="theme.icon" :size="18" />
                  <span class="flex-1 text-left">{{ theme.label }}</span>
                  <CheckIcon v-if="currentTheme === theme.value" :size="16" />
                </button>
              </div>
            </transition>
          </div>

          <!-- Notifications -->
          <button
            type="button"
            class="relative flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
            :aria-label="labels.notifications"
          >
            <BellIcon :size="20" />
            <span
              v-if="badgeCount > 0"
              class="absolute right-0.5 top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900"
              :aria-label="`${badgeCount} unread notifications`"
            >
              {{ badgeCount > 99 ? '99+' : badgeCount }}
            </span>
          </button>

          <!-- Profile Menu -->
          <div class="relative" ref="profileDropdownRef">
            <button
              type="button"
              @click="toggleProfileMenu"
              class="flex items-center justify-center rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              :aria-label="labels.profile"
              :aria-expanded="profileMenuOpen"
            >
              <div
                class="h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
              >
                <div class="flex h-full w-full items-center justify-center text-white">
                  <UserIcon :size="18" />
                </div>
              </div>
            </button>

            <!-- Profile Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="profileMenuOpen"
                class="absolute right-0 top-full mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 motion-reduce:transition-none"
                role="menu"
                :aria-label="labels.profile"
              >
                <div class="py-1">
                  <button
                    type="button"
                    @click="closeProfileMenu"
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    role="menuitem"
                  >
                    <UserIcon :size="18" />
                    <span>{{ labels.profile }}</span>
                  </button>
                  <button
                    type="button"
                    @click="closeProfileMenu"
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    role="menuitem"
                  >
                    <SettingsIcon :size="18" />
                    <span>{{ labels.settings }}</span>
                  </button>
                  <button
                    v-if="showHelp"
                    type="button"
                    @click="closeProfileMenu"
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    role="menuitem"
                  >
                    <HelpCircleIcon :size="18" />
                    <span>{{ labels.help }}</span>
                  </button>
                  <button
                    v-if="showKeyboardShortcuts"
                    type="button"
                    @click="closeProfileMenu"
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    role="menuitem"
                  >
                    <KeyboardIcon :size="18" />
                    <span>{{ labels.keyboardShortcuts }}</span>
                  </button>
                  <div class="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                  <button
                    type="button"
                    @click="handleLogout"
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 focus:outline-none dark:focus:bg-red-900/20 text-red-600 dark:text-red-400"
                    role="menuitem"
                  >
                    <LogOutIcon :size="18" />
                    <span>{{ labels.logout }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </nav>
    </header>

    <!-- Mobile Menu Drawer -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden motion-reduce:transition-none"
        @click="closeMobileMenu"
        aria-hidden="true"
      />
    </transition>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="mobileMenuOpen"
        ref="mobileMenuRef"
        class="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-xl lg:hidden dark:bg-neutral-900 overflow-y-auto motion-reduce:transition-none"
        role="dialog"
        :aria-label="labels.menu"
      >
        <!-- Drawer Header -->
        <div
          class="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div class="flex items-center gap-2">
            <svg
              class="h-7 w-7 text-blue-600 dark:text-blue-500"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="6" fill="currentColor" />
              <path
                d="M16 8L24 12V20L16 24L8 20V12L16 8Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
              />
            </svg>
            <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {{ appName }}
            </span>
          </div>
          <button
            type="button"
            @click="closeMobileMenu"
            class="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
            :aria-label="labels.closeMenu"
          >
            <XIcon :size="22" />
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="p-4">
          <h2
            class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            {{ labels.navigation }}
          </h2>
          <nav class="space-y-1">
            <router-link
              v-for="link in links"
              :key="link.key"
              :to="link.href"
              @click="closeMobileMenu"
              :class="[
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              ]"
              :aria-current="isActive(link.href) ? 'page' : undefined"
            >
              {{ link.label }}
            </router-link>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Menu as MenuIcon,
  X as XIcon,
  Globe as GlobeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Monitor as MonitorIcon,
  Bell as BellIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpCircleIcon,
  Keyboard as KeyboardIcon,
  ChevronDown as ChevronDownIcon,
  Check as CheckIcon,
} from 'lucide-vue-next';

// ============================================================================
// Types
// ============================================================================

export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export interface NavbarLabels {
  skipToContent?: string;
  menu?: string;
  closeMenu?: string;
  language?: string;
  theme?: string;
  themeLight?: string;
  themeDark?: string;
  themeSystem?: string;
  notifications?: string;
  profile?: string;
  settings?: string;
  logout?: string;
  help?: string;
  keyboardShortcuts?: string;
  navigation?: string;
}

type Theme = 'light' | 'dark' | 'system';
type Language = 'uz' | 'ru' | 'en';

// ============================================================================
// Props & Emits
// ============================================================================

interface Props {
  links: NavLink[];
  currentPath?: string;
  badgeCount?: number;
  labels?: Partial<NavbarLabels>;
  appName?: string;
  showHelp?: boolean;
  showKeyboardShortcuts?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  badgeCount: 0,
  appName: 'AutoTest',
  showHelp: true,
  showKeyboardShortcuts: true,
  labels: () => ({}),
});

const emit = defineEmits<{
  logout: [];
  themeChange: [theme: Theme];
  languageChange: [language: Language];
}>();

// ============================================================================
// Composables
// ============================================================================

const route = useRoute();

// ============================================================================
// State
// ============================================================================

const mobileMenuOpen = ref(false);
const languageMenuOpen = ref(false);
const themeMenuOpen = ref(false);
const profileMenuOpen = ref(false);
const currentTheme = ref<Theme>('system');
const currentLanguage = ref<Language>('uz');

const mobileMenuRef = ref<HTMLElement | null>(null);
const languageDropdownRef = ref<HTMLElement | null>(null);
const themeDropdownRef = ref<HTMLElement | null>(null);
const profileDropdownRef = ref<HTMLElement | null>(null);

// ============================================================================
// Labels
// ============================================================================

const defaultLabels: Required<NavbarLabels> = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  closeMenu: 'Close menu',
  language: 'Language',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  notifications: 'Notifications',
  profile: 'Profile',
  settings: 'Settings',
  logout: 'Logout',
  help: 'Help',
  keyboardShortcuts: 'Keyboard shortcuts',
  navigation: 'Navigation',
};

const labels = computed(() => ({
  ...defaultLabels,
  ...props.labels,
}));

// ============================================================================
// Language Data
// ============================================================================

const languages = [
  { code: 'uz' as Language, label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
];

const currentLanguageLabel = computed(() => {
  return languages.find((l) => l.code === currentLanguage.value)?.label || '';
});

// ============================================================================
// Theme Data
// ============================================================================

const themes = computed(() => [
  { value: 'light' as Theme, label: labels.value.themeLight, icon: SunIcon },
  { value: 'dark' as Theme, label: labels.value.themeDark, icon: MoonIcon },
  { value: 'system' as Theme, label: labels.value.themeSystem, icon: MonitorIcon },
]);

const currentThemeIcon = computed(() => {
  if (currentTheme.value === 'light') return SunIcon;
  if (currentTheme.value === 'dark') return MoonIcon;
  return MonitorIcon;
});

// ============================================================================
// Methods
// ============================================================================

function isActive(href: string): boolean {
  if (props.currentPath) {
    return props.currentPath === href;
  }
  return route.path === href;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function toggleLanguageMenu() {
  languageMenuOpen.value = !languageMenuOpen.value;
  themeMenuOpen.value = false;
  profileMenuOpen.value = false;
}

function toggleThemeMenu() {
  themeMenuOpen.value = !themeMenuOpen.value;
  languageMenuOpen.value = false;
  profileMenuOpen.value = false;
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value;
  languageMenuOpen.value = false;
  themeMenuOpen.value = false;
}

function closeProfileMenu() {
  profileMenuOpen.value = false;
}

function handleLanguageChange(language: Language) {
  currentLanguage.value = language;
  localStorage.setItem('language', language);
  languageMenuOpen.value = false;
  emit('languageChange', language);
}

function handleThemeChange(theme: Theme) {
  currentTheme.value = theme;
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  themeMenuOpen.value = false;
  emit('themeChange', theme);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.toggle('dark', systemTheme === 'dark');
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

function handleLogout() {
  profileMenuOpen.value = false;
  emit('logout');
}

// ============================================================================
// Click Outside Handler
// ============================================================================

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;

  if (
    languageDropdownRef.value &&
    !languageDropdownRef.value.contains(target)
  ) {
    languageMenuOpen.value = false;
  }

  if (themeDropdownRef.value && !themeDropdownRef.value.contains(target)) {
    themeMenuOpen.value = false;
  }

  if (profileDropdownRef.value && !profileDropdownRef.value.contains(target)) {
    profileMenuOpen.value = false;
  }
}

// ============================================================================
// Escape Key Handler
// ============================================================================

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (mobileMenuOpen.value) {
      closeMobileMenu();
    }
    if (languageMenuOpen.value) {
      languageMenuOpen.value = false;
    }
    if (themeMenuOpen.value) {
      themeMenuOpen.value = false;
    }
    if (profileMenuOpen.value) {
      profileMenuOpen.value = false;
    }
  }
}

// ============================================================================
// Focus Trap
// ============================================================================

function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  // Initialize theme
  const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  // Initialize language
  const savedLanguage = (localStorage.getItem('language') as Language) || 'uz';
  currentLanguage.value = savedLanguage;

  // Add event listeners
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (currentTheme.value === 'system') {
      applyTheme('system');
    }
  };
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEscapeKey);
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  });
});

// Prevent scroll when mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    // Focus trap
    if (mobileMenuRef.value) {
      trapFocus(mobileMenuRef.value);
    }
  } else {
    document.body.style.overflow = '';
  }
});

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    closeMobileMenu();
  }
);
</script>

<style scoped>
/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: absolute !important;
  width: auto !important;
  height: auto !important;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
