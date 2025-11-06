<script setup lang="ts">
// Left panel component for login page
// Displays branding, features, and statistics
</script>

<template>
  <v-card class="info-card" elevation="0">
    <v-card-text class="pa-8">
      <!-- Brand Header -->
      <div class="brand-header">
        <div class="logo-container">
          <img src="@/assets/images/logoMain.png" alt="Logo" class="main-logo" />
        </div>
        <h1 class="brand-title">Usmonov Avto Test</h1>
        <p class="brand-tagline">PROFESSIONAL DRIVING EDUCATION</p>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <h2 class="features-title">Haydovchilik Guvohnomasini Olishga Tayyor bo'ling</h2>
        <p class="features-description">
          Professional yo'l harakati qoidalari va amaliy test mashqlari bilan to'liq tayyorgarlik ko'ring.
          Rasmiy imtihonlarga ishonch bilan kirish uchun bilimingizni mustahkamlang.
        </p>

        <!-- Feature Cards Grid -->
        <div class="feature-cards">
          <div class="feature-card">
            <div class="feature-icon">
              <v-icon size="28" color="#5c6ec0">mdi-file-document-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Rasmiy Test Savollari</h3>
              <p class="feature-text">1000+ sertifikatlashtirilgan savollar</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <v-icon size="28" color="#5c6ec0">mdi-help-circle-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Yo'l Qoidalari</h3>
              <p class="feature-text">To'liq qonunchilik bazasi</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <v-icon size="28" color="#5c6ec0">mdi-chart-line</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Taraqqiyot Kuzatuvi</h3>
              <p class="feature-text">Real vaqt statistikasi</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <v-icon size="28" color="#5c6ec0">mdi-certificate-outline</v-icon>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">Sertifikat</h3>
              <p class="feature-text">Muvaffaqiyatli tugatish</p>
            </div>
          </div>
        </div>

        <!-- Statistics Section -->
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
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.info-card {
  background: #fff !important;
  border-radius: 16px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
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
    }
  }

  .brand-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #2d3561;
  }

  .brand-tagline {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    color: #7986d3;
    margin: 0;
  }
}

// Features Section
.features-section {
  .features-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
    line-height: 1.3;
    color: #2d3561;
  }

  .features-description {
    font-size: 14px;
    line-height: 1.6;
    color: #616161;
    margin-bottom: 28px;
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #2d3561;
    }

    .feature-text {
      font-size: 12px;
      margin: 0;
      color: #757575;
    }
  }
}

// Statistics Section
.stats-section {
  background: #f5f7fa;
  border: 1px solid #e3e8ef;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #5c6ec0;
    }

    .stat-label {
      font-size: 12px;
      margin: 0;
      color: #757575;
    }
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: #d0d7e3;
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
      font-size: 32px;
    }

    .brand-tagline {
      font-size: 13px;
    }
  }

  .features-section {
    .features-title {
      font-size: 26px;
    }

    .features-description {
      font-size: 14px;
    }
  }

  .stats-section {
    padding: 28px;

    .stat-number {
      font-size: 28px;
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
      font-size: 30px;
    }
  }

  .features-section {
    .features-title {
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
        font-size: 15px;
      }

      .feature-text {
        font-size: 12px;
      }
    }
  }

  .stats-section {
    padding: 24px;

    .stat-number {
      font-size: 26px;
    }

    .stat-label {
      font-size: 12px;
    }
  }
}
</style>
