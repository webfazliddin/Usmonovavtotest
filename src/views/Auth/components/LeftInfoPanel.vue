<script setup lang="ts">
// Left panel component for login page
// Displays branding, features, and statistics
</script>

<template>
  <v-card class="info-card" elevation="0">
    <v-card-text class="pa-8">
      <!-- Brand Header -->
      <div class="brand-header animate-in" style="animation-delay: 0s">
        <div class="logo-container">
          <img src="@/assets/images/logoMain.png" alt="Logo" class="main-logo" />
        </div>
        <h1 class="brand-title">Usmonov Avto Test</h1>
        <p class="brand-tagline">PROFESSIONAL DRIVING EDUCATION</p>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <!-- Feature Cards Grid -->
        <div class="feature-cards">
          <div class="feature-card animate-in" style="animation-delay: 0.1s">
            <div class="feature-icon">
              <v-icon size="28" color="#5D87FF">mdi-file-document-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Rasmiy Test Savollari</h3>
              <p class="feature-text">1000+ sertifikatlashtirilgan savollar</p>
            </div>
          </div>

          <div class="feature-card animate-in" style="animation-delay: 0.2s">
            <div class="feature-icon">
              <v-icon size="28" color="#5D87FF">mdi-help-circle-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Yo'l Qoidalari</h3>
              <p class="feature-text">To'liq qonunchilik bazasi</p>
            </div>
          </div>

          <div class="feature-card animate-in" style="animation-delay: 0.3s">
            <div class="feature-icon">
              <v-icon size="28" color="#5D87FF">mdi-chart-line</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Taraqqiyot Kuzatuvi</h3>
              <p class="feature-text">Real vaqt statistikasi</p>
            </div>
          </div>

          <div class="feature-card animate-in" style="animation-delay: 0.4s">
            <div class="feature-icon">
              <v-icon size="28" color="#5D87FF">mdi-certificate-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Sertifikat</h3>
              <p class="feature-text">Muvaffaqiyatli tugatish</p>
            </div>
          </div>
        </div>

      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-in {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.info-card {
  background: #fff !important;
  border-radius: 16px !important;
  box-shadow: none !important;
  max-width: 100%;
  transition: all 0.3s ease;
}

// Brand Header
.brand-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-container {
    display: inline-block;
    background: #f5f7fa;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid #e3e8ef;
    margin-bottom: 20px;

    .main-logo {
      width: 80px;
      height: auto;
      display: block;
      animation: float 3s ease-in-out infinite;
    }
  }

  .brand-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1F2937;
  }

  .brand-tagline {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    color: #7986d3;
    margin: 0;
  }
}

// Feature Cards Grid
.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.feature-card {
  background: #f5f7fa;
  border: 1px solid #e3e8ef;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #eef2f7;
  }

  .feature-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e3e8ef;
  }

  .feature-content {
    flex: 1;

    .feature-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #1F2937;
    }

    .feature-text {
      font-size: 12px;
      margin: 0;
      color: #6B7280;
    }
  }
}


// Responsive Design
@media (max-width: 1279px) {
  .brand-header {
    margin-bottom: 40px;

    .logo-container .main-logo {
      width: 90px;
    }

    .brand-title {
      font-size: 24px;
    }

    .brand-tagline {
      font-size: 13px;
    }
  }

}

@media (max-width: 1023px) {
  .brand-header {
    margin-bottom: 36px;

    .logo-container {
      padding: 20px;

      .main-logo {
        width: 80px;
      }
    }

    .brand-title {
      font-size: 24px;
    }
  }

  .feature-cards {
    gap: 14px;
    margin-bottom: 36px;
  }

  .feature-card {
    padding: 18px;

    .feature-icon {
      width: 52px;
      height: 52px;
    }

    .feature-content {
      .feature-title {
        font-size: 14px;
      }

      .feature-text {
        font-size: 12px;
      }
    }
  }

}
</style>
