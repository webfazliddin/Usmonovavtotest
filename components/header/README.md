# Responsive Navbar Component

A production-ready, fully accessible header/navbar component for Next.js applications with React, TypeScript, and Tailwind CSS.

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
npm install lucide-react clsx tailwind-merge
# or
yarn add lucide-react clsx tailwind-merge
# or
pnpm add lucide-react clsx tailwind-merge
```

### 2. Install Dev Dependencies (if not already installed)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode via class
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-0': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in-95': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-from-top-2': {
          '0%': { transform: 'translateY(-0.5rem)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'in': 'in 0.2s ease-out',
        'fade-in-0': 'fade-in-0 0.2s ease-out',
        'zoom-in-95': 'zoom-in-95 0.2s ease-out',
        'slide-in-from-top-2': 'slide-in-from-top-2 0.2s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
```

### 4. Add Global Styles

Add to your `app/globals.css`:

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

.sr-only:not(.focus\\:not-sr-only:focus) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
}
```

## Usage

### Basic Example

```tsx
'use client';

import { Navbar } from '@/components/header/Navbar';
import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/tests', label: 'Tests', key: 'tests' },
    { href: '/pricing', label: 'Pricing', key: 'pricing' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ];

  const handleLogout = () => {
    // Your logout logic
    console.log('Logging out...');
  };

  return (
    <>
      <Navbar
        links={navLinks}
        currentPath={pathname}
        onLogout={handleLogout}
        badgeCount={5}
      />
      <main id="main-content">
        {children}
      </main>
    </>
  );
}
```

### With All Props

```tsx
<Navbar
  links={navLinks}
  currentPath={pathname}
  onLogout={handleLogout}
  onThemeChange={(theme) => console.log('Theme:', theme)}
  onLanguageChange={(lang) => console.log('Language:', lang)}
  badgeCount={3}
  labels={{
    skipToContent: 'Skip to content',
    menu: 'Menu',
    // ... other custom labels
  }}
  showHelp={true}
  showKeyboardShortcuts={true}
  className="custom-class"
/>
```

### Internationalization Example

```tsx
// Uzbek version
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
};

<Navbar
  links={navLinks}
  currentPath={pathname}
  onLogout={handleLogout}
  labels={uzbekLabels}
/>
```

## Props API

### `NavbarProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `links` | `NavLink[]` | Yes | - | Navigation links array |
| `currentPath` | `string` | Yes | - | Current page path for active link styling |
| `onLogout` | `() => void` | Yes | - | Logout handler function |
| `onThemeChange` | `(theme: Theme) => void` | No | - | Theme change callback |
| `onLanguageChange` | `(lang: Language) => void` | No | - | Language change callback |
| `badgeCount` | `number` | No | `0` | Notification badge count |
| `labels` | `NavbarLabels` | No | English | Custom labels for i18n |
| `className` | `string` | No | - | Additional CSS classes |
| `showHelp` | `boolean` | No | `true` | Show Help menu item |
| `showKeyboardShortcuts` | `boolean` | No | `true` | Show Keyboard shortcuts item |

### `NavLink` Interface

```ts
interface NavLink {
  href: string;    // Route path
  label: string;   // Display text
  key: string;     // Unique identifier
}
```

### `Theme` Type

```ts
type Theme = 'light' | 'dark' | 'system';
```

### `Language` Type

```ts
type Language = 'uz' | 'ru' | 'en';
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close open menus/drawer |
| `Arrow Keys` | Navigate within dropdowns (future enhancement) |

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

- **SSR-Safe**: No hydration errors
- **No Layout Shift**: Fixed height prevents CLS
- **Optimized Animations**: Uses `transform` and `opacity`
- **Lazy Dropdowns**: Only rendered when open
- **Minimal Re-renders**: Memoized callbacks recommended

## Customization

### Custom Logo

Replace the SVG logo in the component:

```tsx
<svg className="h-8 w-8 text-blue-600" viewBox="0 0 32 32">
  {/* Your custom logo path */}
</svg>
```

### Custom Colors

Modify Tailwind classes:

```tsx
// Primary color (blue-600 → purple-600)
className="text-purple-600 dark:text-purple-500"

// Hover states
className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
```

### Custom Heights

```tsx
// Desktop: h-16 (64px) → h-20 (80px)
// Mobile: h-14 (56px) → h-16 (64px)
<nav className="h-20 lg:h-20">
```

## Troubleshooting

### Dark mode not working

Ensure your `tailwind.config.js` has `darkMode: 'class'` and the root HTML element receives the `dark` class.

### Animations not smooth

Check for `prefers-reduced-motion` settings and ensure Tailwind animations are configured correctly.

### Mobile menu not closing

Verify that `currentPath` prop is being updated when routes change.

### Focus trap issues

Ensure all interactive elements inside the drawer are properly tabbable (no `tabindex="-1"` on focusable elements).

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
