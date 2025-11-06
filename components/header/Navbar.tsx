'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  Bell,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Keyboard,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'uz' | 'ru' | 'en';

export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export interface NavbarLabels {
  skipToContent?: string;
  menu?: string;
  closeMenu?: string;
  home?: string;
  tests?: string;
  pricing?: string;
  about?: string;
  contact?: string;
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
  actions?: string;
}

export interface NavbarProps {
  links: NavLink[];
  currentPath: string;
  onLogout: () => void;
  onThemeChange?: (theme: Theme) => void;
  onLanguageChange?: (language: Language) => void;
  badgeCount?: number;
  labels?: NavbarLabels;
  className?: string;
  showHelp?: boolean;
  showKeyboardShortcuts?: boolean;
}

// ============================================================================
// Default Labels
// ============================================================================

const defaultLabels: Required<NavbarLabels> = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  closeMenu: 'Close menu',
  home: 'Home',
  tests: 'Tests',
  pricing: 'Pricing',
  about: 'About',
  contact: 'Contact',
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
  actions: 'Actions',
};

// ============================================================================
// Utility Hooks
// ============================================================================

function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
}

function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
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

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTabKey);
  }, [ref, isActive]);
}

// ============================================================================
// Language Data
// ============================================================================

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'uz', label: 'O'zbek', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// ============================================================================
// Dropdown Components
// ============================================================================

interface DropdownProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  ariaLabel: string;
  align?: 'left' | 'right';
}

function Dropdown({ children, isOpen, onClose, trigger, ariaLabel, align = 'right' }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, onClose);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 min-w-[200px] rounded-lg border border-neutral-200 bg-white shadow-lg',
            'dark:border-neutral-700 dark:bg-neutral-800',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200',
            'motion-reduce:animate-none',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
          aria-label={ariaLabel}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Navbar Component
// ============================================================================

export function Navbar({
  links,
  currentPath,
  onLogout,
  onThemeChange,
  onLanguageChange,
  badgeCount = 0,
  labels: customLabels,
  className,
  showHelp = true,
  showKeyboardShortcuts = true,
}: NavbarProps) {
  const labels = { ...defaultLabels, ...customLabels };

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('uz');

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(mobileMenuRef, mobileMenuOpen);

  // Initialize theme from localStorage (SSR-safe)
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = (localStorage.getItem('language') as Language) || 'uz';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Apply theme
  function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  // Handle theme change
  function handleThemeChange(theme: Theme) {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setThemeMenuOpen(false);
    onThemeChange?.(theme);
  }

  // Handle language change
  function handleLanguageChange(language: Language) {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    setLanguageMenuOpen(false);
    onLanguageChange?.(language);
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Theme icon
  const ThemeIcon = currentTheme === 'light' ? Sun : currentTheme === 'dark' ? Moon : Monitor;

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className={cn(
          'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999]',
          'rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:bg-neutral-800 dark:text-neutral-100'
        )}
      >
        {labels.skipToContent}
      </a>

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full',
          'border-b border-neutral-200/50 bg-white/80 shadow-sm backdrop-blur-md',
          'dark:border-neutral-800/50 dark:bg-neutral-900/80',
          'transition-colors duration-200',
          className
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:h-16"
          aria-label={labels.navigation}
        >
          {/* Left: Logo + Product Name */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button - Visible only on mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'inline-flex items-center justify-center rounded-lg p-2 text-neutral-700',
                'hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'dark:text-neutral-300 dark:hover:bg-neutral-800',
                'transition-colors duration-200 lg:hidden'
              )}
              aria-label={mobileMenuOpen ? labels.closeMenu : labels.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-500"
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                AutoTest
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-1">
              {links.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2" aria-label={labels.actions}>
            {/* Language Switcher */}
            <Dropdown
              isOpen={languageMenuOpen}
              onClose={() => setLanguageMenuOpen(false)}
              ariaLabel={labels.language}
              trigger={
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium',
                    'text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'dark:text-neutral-300 dark:hover:bg-neutral-800',
                    'transition-colors duration-200'
                  )}
                  aria-label={labels.language}
                  aria-expanded={languageMenuOpen}
                >
                  <Globe size={20} />
                  <span className="hidden sm:inline">
                    {languages.find((l) => l.code === currentLanguage)?.label}
                  </span>
                  <ChevronDown size={16} className={cn('transition-transform', languageMenuOpen && 'rotate-180')} />
                </button>
              }
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                    currentLanguage === lang.code
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-neutral-700 dark:text-neutral-300'
                  )}
                  role="menuitem"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                  {currentLanguage === lang.code && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </Dropdown>

            {/* Theme Toggle */}
            <Dropdown
              isOpen={themeMenuOpen}
              onClose={() => setThemeMenuOpen(false)}
              ariaLabel={labels.theme}
              trigger={
                <button
                  type="button"
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className={cn(
                    'flex items-center justify-center rounded-lg p-2',
                    'text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'dark:text-neutral-300 dark:hover:bg-neutral-800',
                    'transition-colors duration-200'
                  )}
                  aria-label={labels.theme}
                  aria-expanded={themeMenuOpen}
                >
                  <ThemeIcon size={20} />
                </button>
              }
            >
              {[
                { value: 'light' as Theme, label: labels.themeLight, icon: Sun },
                { value: 'dark' as Theme, label: labels.themeDark, icon: Moon },
                { value: 'system' as Theme, label: labels.themeSystem, icon: Monitor },
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleThemeChange(theme.value)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                      'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                      currentTheme === theme.value
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    )}
                    role="menuitem"
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{theme.label}</span>
                    {currentTheme === theme.value && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </Dropdown>

            {/* Notifications */}
            <button
              type="button"
              className={cn(
                'relative flex items-center justify-center rounded-lg p-2',
                'text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                'dark:text-neutral-300 dark:hover:bg-neutral-800',
                'transition-colors duration-200'
              )}
              aria-label={labels.notifications}
            >
              <Bell size={20} />
              {badgeCount > 0 && (
                <span
                  className={cn(
                    'absolute right-0.5 top-0.5 flex h-5 min-w-[20px] items-center justify-center',
                    'rounded-full bg-red-600 px-1 text-[10px] font-bold text-white',
                    'ring-2 ring-white dark:ring-neutral-900'
                  )}
                  aria-label={`${badgeCount} unread notifications`}
                >
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <Dropdown
              isOpen={profileMenuOpen}
              onClose={() => setProfileMenuOpen(false)}
              ariaLabel={labels.profile}
              trigger={
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={cn(
                    'flex items-center justify-center rounded-lg p-1',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'transition-all duration-200'
                  )}
                  aria-label={labels.profile}
                  aria-expanded={profileMenuOpen}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <User size={18} />
                    </div>
                  </div>
                </button>
              }
            >
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(false)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                    'text-neutral-700 dark:text-neutral-300'
                  )}
                  role="menuitem"
                >
                  <User size={18} />
                  <span>{labels.profile}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(false)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                    'text-neutral-700 dark:text-neutral-300'
                  )}
                  role="menuitem"
                >
                  <Settings size={18} />
                  <span>{labels.settings}</span>
                </button>
                {showHelp && (
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(false)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                      'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                      'text-neutral-700 dark:text-neutral-300'
                    )}
                    role="menuitem"
                  >
                    <HelpCircle size={18} />
                    <span>{labels.help}</span>
                  </button>
                )}
                {showKeyboardShortcuts && (
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(false)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                      'focus:bg-neutral-100 focus:outline-none dark:focus:bg-neutral-700',
                      'text-neutral-700 dark:text-neutral-300'
                    )}
                    role="menuitem"
                  >
                    <Keyboard size={18} />
                    <span>{labels.keyboardShortcuts}</span>
                  </button>
                )}
                <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    'hover:bg-red-50 dark:hover:bg-red-900/20',
                    'focus:bg-red-50 focus:outline-none dark:focus:bg-red-900/20',
                    'text-red-600 dark:text-red-400'
                  )}
                  role="menuitem"
                >
                  <LogOut size={18} />
                  <span>{labels.logout}</span>
                </button>
              </div>
            </Dropdown>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden',
              'animate-in fade-in-0 duration-200',
              'motion-reduce:animate-none'
            )}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            ref={mobileMenuRef}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-xl lg:hidden',
              'dark:bg-neutral-900',
              'animate-in slide-in-from-left duration-300',
              'motion-reduce:animate-none',
              'overflow-y-auto'
            )}
            role="dialog"
            aria-label={labels.menu}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <svg
                  className="h-7 w-7 text-blue-600 dark:text-blue-500"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="6" fill="currentColor" />
                  <path
                    d="M16 8L24 12V20L16 24L8 20V12L16 8Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  AutoTest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'rounded-lg p-2 text-neutral-700 hover:bg-neutral-100',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'dark:text-neutral-300 dark:hover:bg-neutral-800',
                  'transition-colors duration-200'
                )}
                aria-label={labels.closeMenu}
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4">
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {labels.navigation}
              </h2>
              <nav className="space-y-1">
                {links.map((link) => {
                  const isActive = currentPath === link.href;
                  return (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
