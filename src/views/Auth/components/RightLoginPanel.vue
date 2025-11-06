<script setup lang="ts">
import LoginForm from "../widgets/LoginForm.vue";

// Right panel component for login page
// Displays welcome message and login form
</script>

<template>
  <v-card class="auth-card" elevation="0">
    <v-card-text class="pa-8 pa-sm-10">
      <!-- Mobile Logo (visible only on mobile) -->
      <div class="mobile-logo d-md-none mb-6">
        <img src="@/assets/images/logoMain.png" alt="Logo" />
      </div>

      <!-- Auth Header -->
      <div class="auth-header mb-8">
        <v-chip color="primary" variant="flat" size="small" class="welcome-chip mb-4">
          <v-icon start size="16">mdi-star</v-icon>
          XUSH KELIBSIZ
        </v-chip>
        <h1 class="auth-title">Tizimga kirish</h1>
        <p class="auth-subtitle">Haydovchilik bilimingizni sinab ko'ring</p>
      </div>

      <!-- Login Form -->
      <LoginForm />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.auth-card {
  background: #fff !important;
  border-radius: 16px !important;
  border: 1px solid #e3e8ef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  max-width: 480px;
  transition: all 0.3s ease;
}

// Mobile Logo
.mobile-logo {
  text-align: center;

  img {
    width: 80px;
  }
}

// Auth Header
.auth-header {
  text-align: center;

  .welcome-chip {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    height: 28px;
    background: #5c6ec0 !important;
  }

  .auth-title {
    font-size: 32px;
    font-weight: 700;
    color: #2d3561;
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
// Tablet (600px - 959px)
@media (max-width: 959px) {
  .auth-card {
    max-width: 100%;
    margin: 0 auto;
  }

  .auth-header .auth-title {
    font-size: 28px;
  }
}

// Mobile Landscape (480px - 599px)
@media (min-width: 480px) and (max-width: 599px) {
  .auth-card {
    border-radius: 24px !important;

    :deep(.v-card-text) {
      padding: 32px 28px !important;
    }
  }

  .mobile-logo img {
    width: 70px;
  }

  .auth-header {
    margin-bottom: 28px;

    .welcome-chip {
      font-size: 10px;
      height: 26px;
    }

    .auth-title {
      font-size: 26px;
    }

    .auth-subtitle {
      font-size: 15px;
    }
  }
}

// Mobile Portrait (< 480px)
@media (max-width: 479px) {
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
}

// Extra Small Mobile (< 360px)
@media (max-width: 359px) {
  .auth-card {
    :deep(.v-card-text) {
      padding: 20px 16px !important;
    }
  }

  .mobile-logo img {
    width: 60px;
  }

  .auth-header {
    .welcome-chip {
      font-size: 9px;
      height: 24px;
    }

    .auth-title {
      font-size: 22px;
    }

    .auth-subtitle {
      font-size: 13px;
    }
  }
}

// Large Desktop (1920px+)
@media (min-width: 1920px) {
  .auth-card {
    max-width: 520px;
  }

  .auth-header {
    .welcome-chip {
      font-size: 12px;
      height: 30px;
    }

    .auth-title {
      font-size: 36px;
    }

    .auth-subtitle {
      font-size: 17px;
    }
  }
}
</style>
