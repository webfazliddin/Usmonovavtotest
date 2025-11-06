# Minimal Clean Design Pattern

Bu loyihada ishlatiladigan minimal va toza dizayn tili. Barcha sahifalar, komponentlar va layoutlar shu uslubda yaratilishi kerak.

## 🎨 Asosiy Dizayn Printsiplari

### 1. **Minimal va Toza**
- Kamroq borderlar, sodda shakllar
- Ko'p bo'sh joy (white space)
- Faqat kerakli elementlar
- Oddiy animatsiyalar (0.2s - 0.3s)

### 2. **Card-Based Layout**
- Har bir komponent oq kartada
- Minimal shadow: `0 2px 8px rgba(0, 0, 0, 0.06)`
- Border radius: `12px` - `16px`
- Border (agar kerak bo'lsa): `1px solid #e3e8ef`

### 3. **Typography**
- Font: **Poppins**, sans-serif
- Heading color: `#2d3561` (dark blue)
- Body text: `#616161` (gray)
- Secondary text: `#757575` (lighter gray)
- Label text: `#9e9e9e` (light gray)

## 🎨 Rang Palitra

### Asosiy Ranglar
```scss
// Background
$bg-main: #f5f7fa;          // Asosiy background
$bg-card: #ffffff;          // Card background
$bg-secondary: #f5f7fa;     // Secondary background
$bg-hover: #eef2f7;         // Hover holati

// Text Colors
$text-primary: #2d3561;     // Asosiy matn
$text-secondary: #616161;   // O'rtacha matn
$text-tertiary: #757575;    // Yordamchi matn
$text-muted: #9e9e9e;       // Och matn

// Borders
$border-light: #f0f0f0;     // Juda och border
$border-main: #e3e8ef;      // Asosiy border
$border-dark: #d0d7e3;      // Quyuqroq border

// Brand Colors
$primary: #5c6ec0;          // Asosiy brand rang
$primary-dark: #2d3561;     // Quyuq brand rang
$primary-light: #7986d3;    // Och brand rang
```

### Shadow Darajalari
```scss
// Minimal shadows - faqat 3 daraja
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);      // Juda kichik
$shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);      // O'rtacha (eng ko'p ishlatiladigan)
$shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.08);     // Katta (hover holati)
```

## 📐 Component Patterns

### Login Page (SignIn.vue)
```vue
<style lang="scss">
// Wrapper
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #f5f7fa;  // Sodda rang, gradient yo'q
}

// Cards
.info-card,
.auth-card {
  background: #fff !important;
  border-radius: 16px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  max-width: 100%;
  transition: all 0.3s ease;
}

// Feature cards
.feature-card {
  background: #f5f7fa;
  border: 1px solid #e3e8ef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #eef2f7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

// Icons
.feature-icon {
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e3e8ef;
}

// Typography
.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3561;
}

.features-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3561;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d3561;
}

.feature-text {
  font-size: 12px;
  color: #757575;
}
</style>
```

### Header (VerticalHeader.vue)
```vue
<style lang="scss">
.header {
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  // Kamroq gap
  .header-right-side {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// Dark mode toggle
label {
  width: 40px;
  height: 40px;
  border-radius: 10px;  // Circle emas, rounded square
  background: #f5f7fa;

  &:hover {
    background: #eef2f7;
  }

  // Sodda transition
  .sun, .moon {
    color: #5c6ec0;
    transition: 0.3s ease;
  }
}
</style>
```

### Sidebar (VerticalSidebar.vue)
```vue
<style lang="scss">
.leftSidebar {
  background: #fff !important;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06) !important;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;  // Juda och border

  .logo-img {
    border-radius: 8px;
  }

  .brand-text {
    font-family: 'Poppins', sans-serif;
    color: #2d3561;
    font-size: 18px;
    font-weight: 600;
  }

  .toggle-btn {
    width: 32px;
    height: 32px;
    background: #f5f7fa;
    border-radius: 8px;

    &:hover {
      background: #eef2f7;
    }
  }
}

// Scrollbar
.scrollnavbar {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e3e8ef;
    border-radius: 3px;

    &:hover {
      background: #d0d7e3;
    }
  }
}
</style>
```

### Navigation Items
```vue
<style lang="scss">
// Nav Item
.nav-item {
  min-height: 44px !important;
  margin-bottom: 4px !important;
  border-radius: 10px !important;
  transition: all 0.2s ease !important;

  &:hover {
    background: #f5f7fa !important;
  }

  &.v-list-item--active {
    background: #eef2f7 !important;

    .nav-title {
      color: #5c6ec0 !important;
      font-weight: 600 !important;
    }
  }

  .nav-title {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #616161;
    font-weight: 500;
  }
}

// Nav Group Header
.nav-group-header {
  padding: 16px 12px 8px 12px !important;

  .group-text {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #9e9e9e;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
</style>
```

### Main Layout
```vue
<style lang="scss">
.app-layout {
  background: #f5f7fa !important;
}

.main-content {
  background: #f5f7fa !important;
  padding-top: 80px !important;
}

.page-wrapper {
  padding: 24px 24px 60px 24px;
}

// Page transitions - sodda
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## 🎯 Qoidalar

### ✅ Ishlating
- Oq background: `#ffffff`
- Och kulrang background: `#f5f7fa`
- Minimal shadow: `0 2px 8px rgba(0, 0, 0, 0.06)`
- Border radius: `10px` - `16px`
- Sodda transition: `0.2s` - `0.3s ease`
- Kamroq borderlar
- Ko'p bo'sh joy (padding, margin)
- Poppins font
- #2d3561 va #5c6ec0 ranglar

### ❌ Ishlatmang
- Gradient backgroundlar
- Ko'p borderlar
- Katta shadowlar
- Murakkab animatsiyalar
- DM Sans font (eski)
- Rang ko'pligi
- Glassmorphism effektlar
- Animated orblar
- Ko'p rang o'zgarishlari

## 📝 Misol: Yangi Page/Component Yaratish

```vue
<template>
  <div class="page-wrapper">
    <!-- Main Card -->
    <v-card class="content-card" elevation="0">
      <v-card-title class="card-title">
        Sarlavha
      </v-card-title>
      <v-card-text class="pa-6">
        <!-- Content here -->
        <div class="item-list">
          <div class="list-item">
            <div class="item-icon">
              <v-icon color="#5c6ec0">mdi-check</v-icon>
            </div>
            <div class="item-content">
              <h4 class="item-title">Birinchi element</h4>
              <p class="item-text">Bu yerda matn</p>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.page-wrapper {
  padding: 24px;
}

.content-card {
  background: #fff !important;
  border-radius: 16px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #2d3561;
  padding: 24px 24px 16px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #eef2f7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.item-icon {
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e3e8ef;
}

.item-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2d3561;
  margin-bottom: 4px;
}

.item-text {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #616161;
  margin: 0;
}
</style>
```

## 🔧 Border Ishlatish Qoidalari

Borderlardan **juda kam** foydalanamiz:

1. **Sidebar header** - `1px solid #f0f0f0` (juda och)
2. **Icon containers** - `1px solid #e3e8ef` (kerak bo'lsa)
3. **Feature cards** - `1px solid #e3e8ef` (agar background och bo'lsa)

**Ko'pincha border o'rniga:**
- Background farqi (`#fff` vs `#f5f7fa`)
- Minimal shadow (`0 2px 8px rgba(0, 0, 0, 0.06)`)
- Bo'sh joy (padding/margin)

## 📱 Responsive Design

```scss
// Mobile
@media (max-width: 768px) {
  .content-card {
    border-radius: 12px !important;

    :deep(.v-card-text) {
      padding: 20px !important;
    }
  }

  .card-title {
    font-size: 20px;
  }
}

// Tablet
@media (min-width: 769px) and (max-width: 1024px) {
  .page-wrapper {
    padding: 20px;
  }
}
```

## ✨ Animation Principles

```scss
// Faqat sodda animatsiyalar
.element {
  transition: all 0.2s ease;  // Tez va sodda
}

// Hover holati
.element:hover {
  transform: translateY(-2px);  // Kichik harakat
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);  // Ozgina shadow
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;  // 0.2s - ideal
}
```

---

**Eslab qoling:** Minimal = Kamroq border, sodda ranglar, ko'p bo'sh joy, tez animatsiyalar! 🎯
