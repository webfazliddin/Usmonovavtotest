# Design Patterns & Style Guide
## Usmonov Avto Test - Login Page Design System

This document outlines the design patterns, color schemes, and UI components used in the login page. Use this as a reference for maintaining consistent design across the application.

---

## 🎨 Color Palette

### Primary Colors
```scss
// Deep Blue Gradient - Main Background
$primary-gradient: linear-gradient(135deg, #2d3561 0%, #3f4c94 25%, #4a5ba8 50%, #5c6ec0 75%, #7986d3 100%);

// Purple Accent Gradient - Buttons & Highlights
$accent-gradient: linear-gradient(135deg, #673ab7, #5c6bc0);

// Text Colors
$text-primary: #2d3561;
$text-secondary: #616161;
$text-light: #757575;
$text-white: #ffffff;
```

### Background Colors
```scss
$bg-white: #ffffff;
$bg-light-gray: #f5f5f5;
$bg-hover: #fafafa;
$bg-glass: rgba(255, 255, 255, 0.1);
$bg-glass-hover: rgba(255, 255, 255, 0.15);
```

### Border & Shadow
```scss
$border-light: #e0e0e0;
$border-focus: #673ab7;
$shadow-card: 0 20px 60px rgba(0, 0, 0, 0.3);
$shadow-button: 0 8px 24px rgba(103, 58, 183, 0.3);
$shadow-hover: 0 12px 32px rgba(103, 58, 183, 0.4);
```

---

## 📐 Layout Structure

### Two-Column Layout
The login page uses a responsive two-column layout:

**Left Panel (Desktop Only)**
- Information panel with branding
- Feature cards in 2x2 grid
- Statistics section
- Width: 50% (md: 6 cols, lg: 6 cols)

**Right Panel**
- Login form card
- Centered content
- Width: 50% mobile: 100% (md: 6 cols, lg: 5 cols, xl: 4 cols)

### Spacing System
```scss
// Consistent spacing values
$spacing-xs: 8px;
$spacing-sm: 12px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

---

## 🎯 Component Patterns

### 1. Glassmorphism Cards
Used for feature cards and stats section on the left panel.

**Properties:**
- Background: `rgba(255, 255, 255, 0.1)`
- Backdrop filter: `blur(20px)`
- Border: `1px solid rgba(255, 255, 255, 0.15)`
- Border radius: `16px - 20px`
- Hover effect: Slight translation up + background lightening

**Example:**
```scss
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
  }
}
```

### 2. Gradient Text
Used for titles and headings to create visual hierarchy.

**Example:**
```scss
.gradient-text {
  background: linear-gradient(135deg, #2d3561, #4a5ba8, #5c6ec0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 3. Gradient Buttons
Primary action buttons with gradient background and elevation.

**Example:**
```scss
.gradient-button {
  background: linear-gradient(135deg, #673ab7, #5c6bc0) !important;
  box-shadow: 0 8px 24px rgba(103, 58, 183, 0.3);
  border-radius: 12px;
  height: 54px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 12px 32px rgba(103, 58, 183, 0.4);
    transform: translateY(-2px);
  }
}
```

### 4. Input Fields
Modern, clean input fields with focus states.

**Example:**
```scss
.custom-input {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
  min-height: 48px;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
    border-color: #bdbdbd;
  }

  &:focus {
    background: #fff;
    border-color: #673ab7;
    box-shadow: 0 0 0 3px rgba(103, 58, 183, 0.1);
  }
}
```

---

## ✨ Animations

### 1. Gradient Shift (Background)
```scss
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

// Usage
background-size: 400% 400%;
animation: gradientShift 15s ease infinite;
```

### 2. Float Animation (Orbs)
```scss
@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-40px) scale(1.08);
  }
  50% {
    transform: translateY(0) scale(1);
  }
  75% {
    transform: translateY(40px) scale(0.92);
  }
}

// Usage
animation: float 10s ease-in-out infinite;
```

### 3. Pulse Animation (Logo)
```scss
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(103, 58, 183, 0.4);
  }
}

// Usage
animation: pulse 3s ease-in-out infinite;
```

### 4. Slide In Animations
```scss
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Usage
animation: slideInLeft 0.8s ease-out;
animation: slideInRight 0.8s ease-out;
```

---

## 📱 Responsive Breakpoints

### Breakpoint System
```scss
// Extra Small Mobile
$xs: 360px;

// Small Mobile
$sm: 480px;

// Mobile Landscape
$md: 600px;

// Tablet
$lg: 960px;

// Desktop
$xl: 1280px;

// Large Desktop
$xxl: 1920px;
```

### Media Query Patterns
```scss
// Mobile First Approach
@media (max-width: 479px) {
  // Extra small mobile styles
}

@media (min-width: 480px) and (max-width: 599px) {
  // Small mobile landscape
}

@media (min-width: 600px) and (max-width: 959px) {
  // Tablet portrait
}

@media (min-width: 960px) {
  // Desktop and above
}
```

---

## 🎭 Typography

### Font Family
```scss
$font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
```scss
// Desktop
$h1-desktop: 36px;
$h2-desktop: 28px;
$h3-desktop: 16px;
$body-desktop: 15px;
$small-desktop: 13px;

// Mobile
$h1-mobile: 24px;
$h2-mobile: 20px;
$h3-mobile: 14px;
$body-mobile: 14px;
$small-mobile: 12px;
```

### Font Weights
```scss
$font-regular: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
```

---

## 🧩 Feature Card Pattern

The left panel uses a 2x2 grid of feature cards. Each card contains:

1. **Icon Container**
   - Size: 56x56px
   - Background: Gradient
   - Border radius: 12px
   - Icon size: 32px
   - Color: White

2. **Content**
   - Title: 16px, font-weight 600
   - Description: 13px, opacity 0.85

**Grid Setup:**
```scss
.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
```

---

## 📊 Stats Section Pattern

Three statistics displayed horizontally with dividers:

**Structure:**
- Number: 32px, font-weight 700, gradient text
- Label: 13px, opacity 0.9
- Divider: 1px width, height 50px, rgba(255, 255, 255, 0.2)

**Layout:**
```scss
.stats-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
}
```

---

## 🎨 Background Decoration Pattern

Three gradient orbs with blur effect:

**Properties:**
- Filter: `blur(100px)`
- Opacity: 0.3
- Animation: Float with different delays
- Sizes: 600px, 500px, 400px

**Example:**
```scss
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 10s ease-in-out infinite;

  &.orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(103, 58, 183, 0.6), transparent 70%);
    top: -150px;
    right: -150px;
    animation-delay: 0s;
  }
}
```

---

## 🔧 Implementation Guidelines

### 1. Always Use Transitions
Add smooth transitions to interactive elements:
```scss
transition: all 0.3s ease;
```

### 2. Consistent Border Radius
- Cards: 20px - 28px
- Buttons: 10px - 12px
- Inputs: 10px - 12px
- Feature cards: 16px

### 3. Elevation Levels
- Level 1: `0 8px 24px rgba(0, 0, 0, 0.15)`
- Level 2: `0 12px 32px rgba(0, 0, 0, 0.2)`
- Level 3: `0 20px 60px rgba(0, 0, 0, 0.3)`

### 4. Hover States
Always include hover states with:
- Slight elevation increase
- Small translation (usually up)
- Background color change

---

## 📝 Component Checklist

When creating new components, ensure:

- [ ] Responsive design implemented
- [ ] Hover states defined
- [ ] Focus states for interactive elements
- [ ] Smooth transitions added
- [ ] Consistent spacing used
- [ ] Proper contrast ratios
- [ ] Mobile-first approach
- [ ] Accessibility considered

---

## 🌟 Best Practices

1. **Use CSS Custom Properties** for theme colors
2. **Mobile-first approach** for media queries
3. **Glassmorphism** for overlay elements
4. **Gradients** for visual interest
5. **Animations** should be subtle and purposeful
6. **Accessibility** - ensure proper contrast ratios
7. **Performance** - use transform and opacity for animations
8. **Consistency** - follow the established patterns

---

## 🔄 Version History

- **v1.0** - Initial design system (Current)
  - Blue gradient theme
  - Glassmorphism cards
  - Two-column layout
  - Feature cards pattern
  - Stats section

---

## 📚 Related Files

- [SignIn.vue](src/views/Auth/SignIn.vue) - Main login page component
- [LoginForm.vue](src/views/Auth/widgets/LoginForm.vue) - Login form widget
- [index.html](index.html) - Global styles and meta tags
- [vite.config.mts](vite.config.mts) - Build configuration

---

**Last Updated:** 2025-01-26
**Maintained By:** Development Team
