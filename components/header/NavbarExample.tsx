'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, type NavLink, type Theme, type Language } from './Navbar';

/**
 * Example implementation of the Navbar component
 *
 * This shows how to integrate the Navbar into your Next.js application
 * with proper state management and event handlers.
 */
export function NavbarExample() {
  const pathname = usePathname();
  const [notificationCount] = useState(5);

  // Define navigation links
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/tests', label: 'Tests', key: 'tests' },
    { href: '/pricing', label: 'Pricing', key: 'pricing' },
    { href: '/about', label: 'About', key: 'about' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ];

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    // Implement your logout logic here:
    // - Clear authentication tokens
    // - Redirect to login page
    // - Clear user session
  };

  // Handle theme change
  const handleThemeChange = (theme: Theme) => {
    console.log('Theme changed to:', theme);
    // You can add additional logic here, such as:
    // - Analytics tracking
    // - API calls to save user preferences
  };

  // Handle language change
  const handleLanguageChange = (language: Language) => {
    console.log('Language changed to:', language);
    // Implement your i18n logic here:
    // - Update app locale
    // - Refetch content in new language
    // - Save preference to user profile
  };

  // Custom labels (for i18n)
  const customLabels = {
    skipToContent: 'Skip to main content',
    menu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Home',
    tests: 'Tests',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
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
    actions: 'User actions',
  };

  return (
    <Navbar
      links={navLinks}
      currentPath={pathname}
      onLogout={handleLogout}
      onThemeChange={handleThemeChange}
      onLanguageChange={handleLanguageChange}
      badgeCount={notificationCount}
      labels={customLabels}
      showHelp={true}
      showKeyboardShortcuts={true}
    />
  );
}

/**
 * Alternative example with Uzbek labels for internationalization
 */
export function NavbarUzbek() {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { href: '/', label: 'Bosh sahifa', key: 'home' },
    { href: '/tests', label: 'Testlar', key: 'tests' },
    { href: '/pricing', label: 'Narxlar', key: 'pricing' },
    { href: '/about', label: 'Biz haqimizda', key: 'about' },
    { href: '/contact', label: 'Aloqa', key: 'contact' },
  ];

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
    actions: 'Amallar',
  };

  return (
    <Navbar
      links={navLinks}
      currentPath={pathname}
      onLogout={() => console.log('Logout')}
      labels={uzbekLabels}
      badgeCount={3}
    />
  );
}
