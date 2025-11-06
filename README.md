# Usmonov Avto Test 🚗

Professional driving education platform with modern UI/UX design.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3.4-green.svg)
![Vuetify](https://img.shields.io/badge/Vuetify-3.6-blue.svg)

---

## ✨ Features

- 🔐 **Modern Authentication** - Beautiful login page with glassmorphism design
- 📚 **1000+ Test Questions** - Official certified driving test questions
- 🚦 **Traffic Rules** - Complete regulatory database
- 📊 **Progress Tracking** - Real-time statistics and performance monitoring
- 🏆 **Certificate System** - Digital certificates upon successful completion
- 🌐 **Multi-language** - Uzbek (Latin/Cyrillic), Russian, Karakalpak
- 📱 **Responsive** - Works seamlessly on all devices
- ⚡ **High Performance** - Optimized with lazy loading and code splitting

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 New Login Page Design

The login page has been completely redesigned with a modern, professional look:

### Key Features
- **Blue Gradient Background** with animated floating orbs
- **Two-Column Layout** (Desktop):
  - Left: Feature showcase with 4 cards + statistics
  - Right: Login form with clean, modern inputs
- **Glassmorphism Effects** - Modern glass-like cards
- **Smooth Animations** - Entrance, hover, and floating effects
- **Fully Responsive** - Perfect on all screen sizes

### Design Patterns
All design patterns and style guidelines are documented in [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md)

---

## 📁 Project Structure

```
src/
├── views/Auth/
│   ├── SignIn.vue          # New modern login page
│   ├── SignIn_OLD.vue      # Backup of original design
│   └── widgets/
│       └── LoginForm.vue   # Login form component
├── components/             # Reusable components
├── services/              # API services
├── utils/                 # Utility functions
└── app/                   # Core configuration
```

---

## ⚡ Performance Optimizations

### Recently Implemented
✅ **Lazy Component Loading** - Components load on-demand
✅ **Code Splitting** - Separate chunks for libraries
✅ **Optimized Dependencies** - Pre-bundling with Vite
✅ **Async Font Loading** - Non-blocking fonts

### Build Stats
- Build time: ~20s
- Vendor chunk: 259 KB (gzipped: 87.5 KB)
- Vuetify chunk: 242 KB (gzipped: 75.5 KB)

See [componentsLoader.ts](src/componentsLoader.ts) and [vite.config.mts](vite.config.mts) for details.

---

## 🛠 Tech Stack

- **Vue 3.4** - Progressive framework
- **TypeScript** - Type safety
- **Vuetify 3.6** - Material Design
- **Pinia 2.1** - State management
- **Vue Router 4.4** - Routing
- **Axios 1.6** - HTTP client
- **Vite 5.3** - Build tool

---

## 📚 Documentation

- **[DESIGN_PATTERNS.md](DESIGN_PATTERNS.md)** - Complete design system guide
  - Color palette
  - Typography
  - Component patterns
  - Animations
  - Responsive breakpoints
  - Code examples

---

## 🎯 Login Page Components

### Left Panel (Desktop)
```
✓ Animated logo with pulse effect
✓ Feature cards (2x2 grid):
  - Official Test Questions (1000+)
  - Traffic Rules Database
  - Progress Tracking
  - Certificates
✓ Statistics section:
  - 50,000+ Users
  - 95% Success Rate
  - 24/7 Support
```

### Right Panel
```
✓ Welcome chip with icon
✓ Gradient title text
✓ Clean input fields
✓ Password toggle
✓ Remember me checkbox
✓ Gradient button
```

---

## 🎨 Design System Highlights

### Colors
```scss
// Primary Gradient
background: linear-gradient(135deg,
  #2d3561 0%, #3f4c94 25%, #4a5ba8 50%,
  #5c6ec0 75%, #7986d3 100%
);

// Accent Gradient
background: linear-gradient(135deg, #673ab7, #5c6bc0);
```

### Glassmorphism
```scss
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
```

### Animations
- Gradient Shift (background)
- Float (orbs)
- Pulse (logo)
- Slide In (content)

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 480px | Single column |
| Tablet | 600-959px | Single column |
| Desktop | 960px+ | Two columns |
| Large Desktop | 1920px+ | Expanded two columns |

---

## 🔧 Available Scripts

```bash
npm run dev      # Development server (port 5027)
npm run build    # Production build
npm run preview  # Preview build
```

---

## 📦 Environment Variables

Create a `.env` file:
```env
VITE_API_URL="/"
VITE_PORT=5027
VITE_I18N_LOCALE="uz-latn"
VITE_FALLBACK_LOCALE="uz-latn"
VITE_DEFAULT_LOCALE="uz-latn"
```

---

## 🌐 Supported Languages

- 🇺🇿 Uzbek (Latin) - uz-latn
- 🇺🇿 Uzbek (Cyrillic) - uz-cyrl
- 🇷🇺 Russian - ru
- 🇺🇿 Karakalpak - qr

---

## 📝 Recent Changes

### v1.0.0 - New Login Design
- ✅ Complete redesign of login page
- ✅ Blue gradient theme matching screenshot
- ✅ Glassmorphism components
- ✅ Feature showcase panel
- ✅ Statistics section
- ✅ Animated background orbs
- ✅ Improved performance
  - Lazy component loading
  - Better code splitting
  - Optimized dependencies

### Files Modified
- [src/views/Auth/SignIn.vue](src/views/Auth/SignIn.vue) - New design
- [src/componentsLoader.ts](src/componentsLoader.ts) - Lazy loading
- [vite.config.mts](vite.config.mts) - Build optimization
- [index.html](index.html) - Async fonts

### New Files
- [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) - Design system doc
- [src/views/Auth/SignIn_OLD.vue](src/views/Auth/SignIn_OLD.vue) - Backup

---

## 🎓 Learning Resources

### Design Patterns
Read [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) to understand:
- Component architecture
- Style conventions
- Animation patterns
- Responsive design
- Best practices

### Code Examples
All components follow the patterns in DESIGN_PATTERNS.md:
```
├── Glassmorphism cards
├── Gradient text
├── Elevated buttons
├── Custom inputs
└── Smooth animations
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` folder

### Deploy Options
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

---

## 📄 License

Proprietary - All Rights Reserved

---

## 📞 Support

Email: support@usmonovavtotest.uz

---

**Made with ❤️ by the Usmonov Avto Test Team**

**Last Updated:** 2025-01-26 | **Version:** 1.0.0
