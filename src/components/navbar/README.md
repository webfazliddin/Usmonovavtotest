# Vue 3 Responsive Navbar Component

A production-ready, fully accessible header/navbar component for Vue 3 applications with TypeScript and Tailwind CSS.

## Features

### Core Features
- ✅ **Fully Responsive**: Adapts seamlessly from mobile (320px) to desktop (1920px+)
- ✅ **Sticky Header**: Stays at top with translucent blur background
- ✅ **Theme Support**: Light, Dark, and System modes with no FOUC (SSR-safe)
- ✅ **Internationalization**: Built-in language switcher (UZ, RU, EN) with persistence
- ✅ **Keyboard Accessible**: Full keyboard navigation with focus rings
- ✅ **ARIA Compliant**: Proper ARIA labels and roles
- ✅ **Mobile Drawer**: Slide-in navigation panel with focus trap
- ✅ **Smooth Animations**: Respects `prefers-reduced-motion`
- ✅ **TypeScript**: Fully typed with proper interfaces

### UI Elements
- Logo + Product Name (left, always visible)
- Desktop Navigation (center, ≥1024px)
- Language Switcher (right, all sizes)
- Theme Toggle (right, all sizes)
- Notifications with Badge (right, all sizes)
- Profile Menu with Avatar (right, all sizes)
- Mobile Hamburger Menu (left, <1024px)

### Accessibility
- Skip-to-content link
- Focus trap in mobile drawer
- Escape key to close menus
- Click outside to close dropdowns
- Proper ARIA labels and roles
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader friendly

## Installation

### 1. Install Dependencies

```bash
npm install lucide-vue-next
# or
yarn add lucide-vue-next
# or
pnpm add lucide-vue-next
```

### 2. Install Tailwind CSS (if not already installed)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode via class
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 4. Add Global Styles

Add to your `src/assets/main.css` or similar:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Prevent layout shift */
  html {
    scroll-behavior: smooth;
  }

  /* Dark mode colors */
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 5. Update Vue Router (if needed)

Ensure you have Vue Router installed:

```bash
npm install vue-router@4
```

## Usage

### Basic Example

```vue
<template>
  <div>
    <AppNavbar
      :links="navLinks"
      :current-path="route.path"
      :badge-count="5"
      @logout="handleLogout"
      @theme-change="handleThemeChange"
      @language-change="handleLanguageChange"
    />

    <main id="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppNavbar from '@/components/navbar/AppNavbar.vue';
import type { NavLink } from '@/components/navbar/AppNavbar.vue';

const route = useRoute();

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/tests', label: 'Tests', key: 'tests' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

function handleLogout() {
  console.log('Logging out...');
  // Your logout logic
}

function handleThemeChange(theme: 'light' | 'dark' | 'system') {
  console.log('Theme changed:', theme);
}

function handleLanguageChange(language: 'uz' | 'ru' | 'en') {
  console.log('Language changed:', language);
}
</script>
```

### With All Props

```vue
<AppNavbar
  :links="navLinks"
  :current-path="route.path"
  :badge-count="3"
  :labels="customLabels"
  :app-name="'MyApp'"
  :show-help="true"
  :show-keyboard-shortcuts="true"
  @logout="handleLogout"
  @theme-change="handleThemeChange"
  @language-change="handleLanguageChange"
/>
```

### Internationalization Example

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'; // or your i18n solution

const { t } = useI18n();

const customLabels = computed(() => ({
  skipToContent: t('navbar.skipToContent'),
  menu: t('navbar.menu'),
  closeMenu: t('navbar.closeMenu'),
  language: t('navbar.language'),
  theme: t('navbar.theme'),
  themeLight: t('navbar.themeLight'),
  themeDark: t('navbar.themeDark'),
  themeSystem: t('navbar.themeSystem'),
  notifications: t('navbar.notifications'),
  profile: t('navbar.profile'),
  settings: t('navbar.settings'),
  logout: t('navbar.logout'),
  help: t('navbar.help'),
  keyboardShortcuts: t('navbar.keyboardShortcuts'),
  navigation: t('navbar.navigation'),
}));
</script>

<template>
  <AppNavbar
    :links="navLinks"
    :labels="customLabels"
    @logout="handleLogout"
  />
</template>
```

### Uzbek Labels Example

```typescript
const uzbekLabels = {
  skipToContent: 'Asosiy kontentga o\'tish',
  menu: 'Menyu',
  closeMenu: 'Menyuni yopish',
  language: 'Til',
  theme: 'Mavzu',
  themeLight: 'Yorug\'',
  themeDark: 'Qorong\'i',
  themeSystem: 'Tizim',
  notifications: 'Bildirishnomalar',
  profile: 'Profil',
  settings: 'Sozlamalar',
  logout: 'Chiqish',
  help: 'Yordam',
  keyboardShortcuts: 'Klaviatura yorliqlari',
  navigation: 'Navigatsiya',
};
```

## Props API

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `links` | `NavLink[]` | Yes | - | Navigation links array |
| `currentPath` | `string` | No | `route.path` | Current page path for active link styling |
| `badgeCount` | `number` | No | `0` | Notification badge count |
| `labels` | `Partial<NavbarLabels>` | No | English | Custom labels for i18n |
| `appName` | `string` | No | `'AutoTest'` | Application name |
| `showHelp` | `boolean` | No | `true` | Show Help menu item |
| `showKeyboardShortcuts` | `boolean` | No | `true` | Show Keyboard shortcuts item |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `logout` | - | Fired when logout button is clicked |
| `themeChange` | `theme: 'light' \| 'dark' \| 'system'` | Fired when theme is changed |
| `languageChange` | `language: 'uz' \| 'ru' \| 'en'` | Fired when language is changed |

### Interfaces

#### `NavLink`

```typescript
interface NavLink {
  href: string;    // Route path
  label: string;   // Display text
  key: string;     // Unique identifier
}
```

#### `NavbarLabels`

```typescript
interface NavbarLabels {
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
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close open menus/drawer |

## Mobile Behavior

### Breakpoints
- **Desktop**: ≥1024px - Full navigation in center
- **Mobile**: <1024px - Navigation in hamburger drawer

### Mobile Features
- Hamburger menu (left side)
- Slide-in drawer with navigation
- Right-side actions remain visible
- Focus trap in drawer
- Close on route change
- Close on outside click
- Close on Escape key
- Body scroll lock when open

## Accessibility Checklist

- ✅ Skip-to-content link (appears on focus)
- ✅ Semantic HTML (`<nav>`, `<header>`, etc.)
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus indicators (ring-2 ring-blue-500)
- ✅ Focus trap in mobile drawer
- ✅ Screen reader announcements
- ✅ Color contrast (WCAG AA)
- ✅ Reduced motion support
- ✅ Touch target sizes (44×44px minimum)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Chrome Android (latest 2 versions)

## Performance

- **SSR-Safe**: No hydration errors with localStorage access in `onMounted`
- **No Layout Shift**: Fixed height prevents CLS
- **Optimized Animations**: Uses `transform` and `opacity`
- **Conditional Rendering**: Dropdowns only rendered when open
- **Event Cleanup**: Proper listener removal in `onBeforeUnmount`

## Customization

### Custom Logo

Replace the SVG logo in `AppNavbar.vue`:

```vue
<svg class="h-8 w-8 text-blue-600" viewBox="0 0 32 32">
  <!-- Your custom logo path -->
</svg>
```

### Custom Colors

Modify Tailwind classes throughout the component:

```vue
<!-- Primary color (blue-600 → purple-600) -->
<div class="text-purple-600 dark:text-purple-500">

<!-- Hover states -->
<div class="hover:bg-purple-100 dark:hover:bg-purple-900/30">
```

### Custom Heights

```vue
<!-- Desktop: h-16 (64px) → h-20 (80px) -->
<!-- Mobile: h-14 (56px) → h-16 (64px) -->
<nav class="h-14 lg:h-20">
```

### Adding More Languages

```typescript
const languages = [
  { code: 'uz' as Language, label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru' as Language, label: 'Русский', flag: '🇷🇺' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## Integration with Existing Projects

### Vue Router Setup

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/tests', component: () => import('@/views/Tests.vue') },
    { path: '/pricing', component: () => import('@/views/Pricing.vue') },
    { path: '/about', component: () => import('@/views/About.vue') },
    { path: '/contact', component: () => import('@/views/Contact.vue') },
  ],
});

export default router;
```

### App.vue Integration

```vue
<template>
  <div id="app">
    <AppNavbar
      :links="navLinks"
      @logout="handleLogout"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/navbar/AppNavbar.vue';

const navLinks = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/tests', label: 'Tests', key: 'tests' },
  // ...
];

function handleLogout() {
  // Clear auth and redirect
}
</script>
```

## Troubleshooting

### Dark mode not working

Ensure your `tailwind.config.js` has `darkMode: 'class'` and the root HTML element receives the `dark` class.

### Icons not showing

Make sure `lucide-vue-next` is installed:
```bash
npm install lucide-vue-next
```

### Router links not working

Ensure Vue Router is properly installed and configured in your `main.ts`:
```typescript
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

createApp(App).use(router).mount('#app');
```

### Mobile menu not closing on navigation

Verify that the component has access to the router via `useRoute()`.

### TypeScript errors

Make sure you have proper type definitions:
```bash
npm install -D @types/node
```

## Testing

### Component Testing with Vitest

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AppNavbar from './AppNavbar.vue';

describe('AppNavbar', () => {
  it('renders navigation links', () => {
    const wrapper = mount(AppNavbar, {
      props: {
        links: [
          { href: '/', label: 'Home', key: 'home' },
        ],
      },
    });
    expect(wrapper.text()).toContain('Home');
  });

  it('emits logout event', async () => {
    const wrapper = mount(AppNavbar, {
      props: { links: [] },
    });
    // Find and click logout button
    // await wrapper.find('[data-testid="logout"]').trigger('click');
    // expect(wrapper.emitted('logout')).toBeTruthy();
  });
});
```

## License

MIT

## Credits

Built with:
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
