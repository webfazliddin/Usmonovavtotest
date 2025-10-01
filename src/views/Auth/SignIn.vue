<script setup lang="ts">
import LoginForm from "./widgets/LoginForm.vue";
</script>

<template>
  <div class="auth-wrapper">
    <div class="background-decoration">
      <div class="circle circle-top"></div>
      <div class="circle circle-bottom"></div>
    </div>

    <v-container fluid class="auth-container">
      <v-row class="auth-row" align="center" justify="center">
        <v-col cols="12" md="6" lg="5" class="d-none d-md-flex">
          <div class="illustration-wrapper">
            <img
              src="@/assets/images/login-illustration.svg"
              alt="Security"
              class="illustration-image"
            />
            <div class="brand-logo">
              <img src="@/assets/images/logoMain.png" alt="Logo" class="logo-image" />
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" lg="5" xl="4">
          <v-card class="auth-card" elevation="0">
            <v-card-text class="pa-8 pa-sm-10">
              <div class="mobile-logo d-md-none mb-6">
                <img src="@/assets/images/logoMain.png" alt="Logo" />
              </div>

              <div class="auth-header mb-8">
                <h1 class="auth-title">Usmonov Avto Test</h1>
                <p class="auth-subtitle">Xush kelibsiz!</p>
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
  background: linear-gradient(135deg, #e8eaf6, #e1e8f5, #ddd6f3, #e8eaf6, #f0f4f8);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.4;

    &.circle-top {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(103, 58, 183, 0.15), transparent 70%);
      top: -200px;
      right: -100px;
    }

    &.circle-bottom {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(63, 81, 181, 0.15), transparent 70%);
      bottom: -150px;
      left: -100px;
    }
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

.illustration-wrapper {
  max-width: 500px;
  position: relative;
  animation: float 3s ease-in-out infinite;

  .illustration-image {
    width: 100%;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  }

  .brand-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(103, 58, 183, 0.2);
    box-shadow: 0 10px 40px rgba(103, 58, 183, 0.15);

    .logo-image {
      width: 120px;
      display: block;
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.auth-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-radius: 24px !important;
  border: 1px solid rgba(103, 58, 183, 0.1);
  box-shadow: 0 20px 60px rgba(103, 58, 183, 0.15) !important;
  max-width: 480px;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 70px rgba(103, 58, 183, 0.2) !important;
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

  .auth-title {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #673ab7, #3f51b5, #5c6bc0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .auth-subtitle {
    font-size: 16px;
    color: #757575;
    margin: 0;
  }
}

// Responsive Design
// Large Desktop (1920px+)
@media (min-width: 1920px) {
  .auth-card {
    max-width: 550px;
  }

  .illustration-wrapper {
    max-width: 600px;
  }
}

// Desktop (1280px - 1919px)
@media (min-width: 1280px) and (max-width: 1919px) {
  .auth-container {
    max-width: 1200px;
  }

  .illustration-wrapper {
    max-width: 450px;
  }
}

// Tablet Landscape (960px - 1279px)
@media (min-width: 960px) and (max-width: 1279px) {
  .auth-container {
    max-width: 1000px;
    padding: 20px;
  }

  .illustration-wrapper {
    max-width: 400px;
  }

  .auth-card {
    max-width: 450px;
  }

  .background-decoration .circle {
    &.circle-top {
      width: 500px;
      height: 500px;
    }

    &.circle-bottom {
      width: 400px;
      height: 400px;
    }
  }
}

// Tablet Portrait (600px - 959px)
@media (max-width: 959px) {
  .auth-wrapper {
    background: linear-gradient(135deg, #e8eaf6 0%, #e1e8f5 25%, #ddd6f3 50%, #e8eaf6 75%, #f0f4f8 100%);
  }

  .auth-container {
    padding: 20px;
  }

  .auth-row {
    min-height: auto;
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.98) !important;
    max-width: 100%;
    margin: 0 auto;

    &:hover {
      transform: none;
    }
  }

  .auth-header .auth-title {
    font-size: 28px;
  }

  .background-decoration .circle {
    &.circle-top {
      width: 400px;
      height: 400px;
      top: -150px;
      right: -80px;
    }

    &.circle-bottom {
      width: 350px;
      height: 350px;
      bottom: -120px;
      left: -80px;
    }
  }
}

// Mobile Landscape (480px - 599px)
@media (min-width: 480px) and (max-width: 599px) {
  .auth-container {
    padding: 16px;
  }

  .auth-card {
    border-radius: 18px !important;

    :deep(.v-card-text) {
      padding: 28px !important;
    }
  }

  .mobile-logo img {
    width: 70px;
  }

  .auth-header {
    margin-bottom: 24px;

    .auth-title {
      font-size: 26px;
    }

    .auth-subtitle {
      font-size: 15px;
    }
  }

  .background-decoration .circle {
    &.circle-top {
      width: 350px;
      height: 350px;
      top: -120px;
      right: -60px;
    }

    &.circle-bottom {
      width: 300px;
      height: 300px;
      bottom: -100px;
      left: -60px;
    }
  }
}

// Mobile Portrait (320px - 479px)
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
    border-radius: 16px !important;
    box-shadow: 0 15px 50px rgba(103, 58, 183, 0.15) !important;

    :deep(.v-card-text) {
      padding: 24px 20px !important;
    }

    &:hover {
      transform: none;
      box-shadow: 0 15px 50px rgba(103, 58, 183, 0.15) !important;
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

    .auth-title {
      font-size: 22px;
      line-height: 1.3;
    }

    .auth-subtitle {
      font-size: 14px;
    }
  }

  .background-decoration .circle {
    &.circle-top {
      width: 280px;
      height: 280px;
      top: -100px;
      right: -50px;
    }

    &.circle-bottom {
      width: 250px;
      height: 250px;
      bottom: -80px;
      left: -50px;
    }
  }
}

// Extra Small Mobile (< 360px)
@media (max-width: 359px) {
  .auth-container {
    padding: 10px;
  }

  .auth-card {
    :deep(.v-card-text) {
      padding: 20px 16px !important;
    }
  }

  .mobile-logo img {
    width: 60px;
  }

  .auth-header {
    .auth-title {
      font-size: 20px;
    }

    .auth-subtitle {
      font-size: 13px;
    }
  }
}
</style>
