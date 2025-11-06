<script setup lang="ts">
import LoginForm from "./widgets/LoginForm.vue";
</script>

<template>
  <div class="auth-wrapper">
    <div class="background-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <v-container fluid class="auth-container">
      <v-row class="auth-row" align="center" justify="center">
        <!-- Left Side - Info Panel -->
        <v-col cols="12" md="6" lg="6" class="d-none d-md-flex">
          <div class="info-panel">
            <div class="brand-header">
              <div class="logo-container">
                <img src="@/assets/images/logoMain.png" alt="Logo" class="main-logo" />
              </div>
              <h1 class="brand-title">Usmonov Avto Test</h1>
              <p class="brand-tagline">PROFESSIONAL DRIVING EDUCATION</p>
            </div>

            <div class="features-section">
              <h2 class="features-title">Haydovchilik Guvohnomasini Olishga Tayyor bo'ling</h2>
              <p class="features-description">
                Professional yo'l harakati qoidalari va amaliy test mashqlari bilan to'liq tayyorgarlik ko'ring.
                Rasmiy imtihonlarga ishonch bilan kirish uchun bilimingizni mustahkamlang.
              </p>

              <div class="feature-cards">
                <div class="feature-card">
                  <div class="feature-icon">
                    <v-icon size="32" color="#fff">mdi-file-document-outline</v-icon>
                  </div>
                  <div class="feature-content">
                    <h3 class="feature-title">Rasmiy Test Savollari</h3>
                    <p class="feature-text">1000+ sertifikatlashtirilgan savollar</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon">
                    <v-icon size="32" color="#fff">mdi-help-circle-outline</v-icon>
                  </div>
                  <div class="feature-content">
                    <h3 class="feature-title">Yo'l Qoidalari</h3>
                    <p class="feature-text">To'liq qonunchilik bazasi</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon">
                    <v-icon size="32" color="#fff">mdi-chart-line</v-icon>
                  </div>
                  <div class="feature-content">
                    <h3 class="feature-title">Taraqqiyot Kuzatuvi</h3>
                    <p class="feature-text">Real vaqt statistikasi</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-icon">
                    <v-icon size="32" color="#fff">mdi-certificate-outline</v-icon>
                  </div>
                  <div class="feature-content">
                    <h3 class="feature-title">Sertifikat</h3>
                    <p class="feature-text">Muvaffaqiyatli tugatish</p>
                  </div>
                </div>
              </div>

              <div class="stats-section">
                <div class="stat-item">
                  <h3 class="stat-number">50,000+</h3>
                  <p class="stat-label">Foydalanuvchilar</p>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <h3 class="stat-number">95%</h3>
                  <p class="stat-label">Muvaffaqiyat Ko'rsatkichi</p>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <h3 class="stat-number">24/7</h3>
                  <p class="stat-label">Yordam Xizmati</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right Side - Login Form -->
        <v-col cols="12" md="6" lg="5" xl="4">
          <v-card class="auth-card" elevation="0">
            <v-card-text class="pa-8 pa-sm-10">
              <div class="mobile-logo d-md-none mb-6">
                <img src="@/assets/images/logoMain.png" alt="Logo" />
              </div>

              <div class="auth-header mb-8">
                <v-chip color="primary" variant="flat" size="small" class="welcome-chip mb-4">
                  <v-icon start size="16">mdi-star</v-icon>
                  XUSH KELIBSIZ
                </v-chip>
                <h1 class="auth-title">Tizimga kirish</h1>
                <p class="auth-subtitle">Haydovchilik bilimingizni sinab ko'ring</p>
              </div>

              <LoginForm />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #2d3561 0%, #3f4c94 25%, #4a5ba8 50%, #5c6ec0 75%, #7986d3 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.background-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

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

    &.orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(63, 81, 181, 0.5), transparent 70%);
      bottom: -100px;
      left: -100px;
      animation-delay: 3s;
    }

    &.orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(156, 39, 176, 0.4), transparent 70%);
      top: 50%;
      left: 30%;
      animation-delay: 6s;
    }
  }
}

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

.auth-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  padding: 24px;
}

.auth-row {
  min-height: calc(100vh - 48px);
}

// Left Panel Styles
.info-panel {
  width: 100%;
  color: #fff;
  animation: slideInLeft 0.8s ease-out;
}

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

.brand-header {
  text-align: center;
  margin-bottom: 48px;

  .logo-container {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    padding: 24px;
    border-radius: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    margin-bottom: 24px;
    animation: pulse 3s ease-in-out infinite;

    .main-logo {
      width: 100px;
      height: auto;
      display: block;
    }
  }

  .brand-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }

  .brand-tagline {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    opacity: 0.9;
    margin: 0;
  }
}

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

.features-section {
  .features-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .features-description {
    font-size: 15px;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 32px;
  }
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .feature-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(103, 58, 183, 0.8), rgba(63, 81, 181, 0.8));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .feature-content {
    flex: 1;

    .feature-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #fff;
    }

    .feature-text {
      font-size: 13px;
      opacity: 0.85;
      margin: 0;
      color: #fff;
    }
  }
}

.stats-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.8));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 13px;
      opacity: 0.9;
      margin: 0;
    }
  }

  .stat-divider {
    width: 1px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
  }
}

// Right Panel Styles
.auth-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(30px);
  border-radius: 28px !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  max-width: 480px;
  transition: all 0.4s ease;
  animation: slideInRight 0.8s ease-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.35) !important;
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

.mobile-logo {
  text-align: center;

  img {
    width: 80px;
  }
}

.auth-header {
  text-align: center;

  .welcome-chip {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    height: 28px;
  }

  .auth-title {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #2d3561, #4a5ba8, #5c6ec0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .auth-subtitle {
    font-size: 16px;
    color: #616161;
    margin: 0;
  }
}

// Responsive Design
@media (max-width: 959px) {
  .auth-wrapper {
    background: linear-gradient(135deg, #2d3561 0%, #4a5ba8 50%, #5c6ec0 100%);
  }

  .auth-container {
    padding: 20px;
  }

  .auth-row {
    min-height: auto;
  }

  .auth-card {
    background: rgba(255, 255, 255, 1) !important;
    max-width: 100%;
    margin: 0 auto;

    &:hover {
      transform: none;
    }
  }

  .auth-header .auth-title {
    font-size: 28px;
  }

  .background-decoration .gradient-orb {
    &.orb-1 {
      width: 400px;
      height: 400px;
    }
    &.orb-2 {
      width: 350px;
      height: 350px;
    }
    &.orb-3 {
      display: none;
    }
  }
}

@media (max-width: 479px) {
  .auth-wrapper {
    min-height: 100dvh;
  }

  .auth-container {
    padding: 12px;
  }

  .auth-row {
    min-height: calc(100dvh - 24px);
  }

  .auth-card {
    border-radius: 20px !important;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3) !important;

    :deep(.v-card-text) {
      padding: 24px 20px !important;
    }
  }

  .mobile-logo {
    margin-bottom: 20px !important;

    img {
      width: 65px;
    }
  }

  .auth-header {
    margin-bottom: 24px !important;

    .welcome-chip {
      font-size: 10px;
      height: 26px;
    }

    .auth-title {
      font-size: 24px;
    }

    .auth-subtitle {
      font-size: 14px;
    }
  }

  .background-decoration .gradient-orb {
    &.orb-1 {
      width: 280px;
      height: 280px;
    }
    &.orb-2 {
      width: 250px;
      height: 250px;
    }
  }
}
</style>
