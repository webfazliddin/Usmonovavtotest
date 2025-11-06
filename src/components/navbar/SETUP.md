# Quick Setup Guide

Follow these steps to integrate the Vue 3 Navbar component into your project.

## Prerequisites

- Vue 3.x
- TypeScript (recommended)
- Tailwind CSS
- Vue Router 4.x

## Step-by-Step Setup

### 1. Install Required Dependencies

```bash
npm install lucide-vue-next
```

Or if using yarn:
```bash
yarn add lucide-vue-next
```

Or if using pnpm:
```bash
pnpm add lucide-vue-next
```

### 2. Ensure Tailwind CSS is Installed

If you haven't installed Tailwind CSS yet:

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // IMPORTANT: Enable class-based dark mode
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

### 4. Import Tailwind in Your CSS

Create or update `src/assets/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

Import this CSS in your `main.ts`:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css'; // Import Tailwind CSS

createApp(App).use(router).mount('#app');
```

### 5. Copy Component Files

Copy these files to your project:

```
src/
  components/
    navbar/
      AppNavbar.vue       # Main component
      NavbarExample.vue   # Example usage (optional)
      README.md           # Documentation
```

### 6. Update Your App Layout

Update your `App.vue` or main layout component:

```vue
<template>
  <div id="app">
    <AppNavbar
      :links="navLinks"
      :badge-count="notificationCount"
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
import { ref } from 'vue';
import AppNavbar from '@/components/navbar/AppNavbar.vue';
import type { NavLink } from '@/components/navbar/AppNavbar.vue';

const notificationCount = ref(5);

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/tests', label: 'Tests', key: 'tests' },
  { href: '/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

function handleLogout() {
  console.log('Logging out...');
  // Add your logout logic here
}

function handleThemeChange(theme: 'light' | 'dark' | 'system') {
  console.log('Theme changed to:', theme);
  // Add additional theme change logic if needed
}

function handleLanguageChange(language: 'uz' | 'ru' | 'en') {
  console.log('Language changed to:', language);
  // Add your i18n logic here
}
</script>
```

### 7. Configure TypeScript (Optional but Recommended)

If using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

### 8. Configure Path Aliases (Vite)

If using `@/` path alias, ensure your `vite.config.ts` has:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

### 9. Set Up Routes

Ensure your `src/router/index.ts` has routes that match your nav links:

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/tests',
      name: 'Tests',
      component: () => import('@/views/Tests.vue'),
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: () => import('@/views/Pricing.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/Contact.vue'),
    },
  ],
});

export default router;
```

### 10. Test the Component

Run your development server:

```bash
npm run dev
```

Navigate to `http://localhost:5173` (or your configured port) and verify:

- ✅ Navigation links are visible on desktop (≥1024px)
- ✅ Mobile menu button appears on small screens (<1024px)
- ✅ Theme toggle works (Light/Dark/System)
- ✅ Language switcher works (UZ/RU/EN)
- ✅ Notification badge displays correctly
- ✅ Profile menu opens with options
- ✅ All dropdowns close when clicking outside
- ✅ Escape key closes open menus
- ✅ Active route is highlighted
- ✅ Mobile drawer opens and closes smoothly
- ✅ Focus trap works in mobile drawer

## Customization

### Change App Name

```vue
<AppNavbar
  app-name="Your App Name"
  :links="navLinks"
  @logout="handleLogout"
/>
```

### Add Custom Labels (i18n)

```vue
<script setup lang="ts">
const customLabels = {
  skipToContent: 'Asosiy kontentga o\'tish',
  menu: 'Menyu',
  closeMenu: 'Menyuni yopish',
  language: 'Til',
  // ... other labels
};
</script>

<template>
  <AppNavbar
    :labels="customLabels"
    :links="navLinks"
    @logout="handleLogout"
  />
</template>
```

### Update Notification Count

```vue
<script setup lang="ts">
import { ref } from 'vue';

const notificationCount = ref(10); // Update dynamically
</script>

<template>
  <AppNavbar
    :badge-count="notificationCount"
    :links="navLinks"
    @logout="handleLogout"
  />
</template>
```

### Hide Optional Menu Items

```vue
<AppNavbar
  :show-help="false"
  :show-keyboard-shortcuts="false"
  :links="navLinks"
  @logout="handleLogout"
/>
```

## Common Issues & Solutions

### Issue: Icons not appearing
**Solution:** Ensure `lucide-vue-next` is installed:
```bash
npm install lucide-vue-next
```

### Issue: Dark mode not working
**Solution:** Check `tailwind.config.js` has `darkMode: 'class'`

### Issue: Navigation links not working
**Solution:** Verify Vue Router is installed and configured in `main.ts`

### Issue: Dropdowns not closing
**Solution:** Ensure component has proper `ref` attributes and click outside handler

### Issue: TypeScript errors
**Solution:** Install type definitions:
```bash
npm install -D @types/node
```

### Issue: Mobile menu not closing on route change
**Solution:** Component uses `watch` on `route.path` - ensure Vue Router is accessible

## Next Steps

1. **Implement Logout Logic**: Add authentication token clearing and redirect
2. **Connect i18n**: Integrate with Vue I18n or your i18n solution
3. **Add Analytics**: Track theme/language changes
4. **Customize Styling**: Update colors, spacing, and fonts to match your brand
5. **Add Notifications**: Implement real notification system
6. **Profile Menu Actions**: Add actual navigation to profile/settings pages

## Support

For issues or questions:
- Check the [README.md](./README.md) for detailed documentation
- Review the [NavbarExample.vue](./NavbarExample.vue) for implementation examples
- Check browser console for errors

## Testing Checklist

- [ ] Desktop navigation displays correctly (≥1024px)
- [ ] Mobile menu button appears (<1024px)
- [ ] Mobile drawer opens/closes smoothly
- [ ] Theme toggle works (Light/Dark/System)
- [ ] Language switcher works (UZ/RU/EN)
- [ ] Notification badge displays count
- [ ] Profile menu opens with all options
- [ ] Logout event fires correctly
- [ ] Active route is highlighted
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Click outside closes dropdowns
- [ ] Escape key closes menus
- [ ] Focus trap works in mobile drawer
- [ ] Reduced motion is respected
- [ ] Skip-to-content link appears on Tab
- [ ] No layout shift on theme toggle
- [ ] LocalStorage persists theme/language

## Performance Checklist

- [ ] No hydration errors (SSR-safe)
- [ ] No console warnings/errors
- [ ] Smooth animations (60fps)
- [ ] No layout shift (CLS = 0)
- [ ] Fast interaction (FID < 100ms)
- [ ] Proper event cleanup on unmount

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are ≥44×44px
- [ ] Skip-to-content link works

---

**Ready to go!** 🚀

Your responsive navbar is now set up and ready to use. Happy coding!
