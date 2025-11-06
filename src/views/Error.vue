<template>
  <div class="error-page">
    <div class="error-content">
      <img src="@/assets/images/errorimg.svg" alt="404" class="error-image" />
      <h1 class="error-title">Opps!!!</h1>
      <h4 class="error-subtitle">
        {{ $t("notFoundPageTitle") }}
      </h4>
      <v-btn flat color="primary" class="error-button" to="/">
        {{ $t("goHome") }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  padding: 20px;
}

.error-content {
  max-width: 600px;
  width: 100%;
}

.error-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.error-title {
  font-size: 48px;
  font-weight: 700;
  margin-top: 24px;
}

.error-subtitle {
  font-size: 24px;
  margin: 32px 0;
}

.error-button {
  margin-bottom: 16px;
}

// Tablet styles
@media (max-width: 768px) {
  .error-image {
    max-width: 400px;
  }

  .error-title {
    font-size: 36px;
  }

  .error-subtitle {
    font-size: 20px;
    margin: 24px 0;
  }
}

// Mobile styles
@media (max-width: 480px) {
  .error-page {
    padding: 16px;
  }

  .error-image {
    max-width: 280px;
  }

  .error-title {
    font-size: 28px;
    margin-top: 16px;
  }

  .error-subtitle {
    font-size: 16px;
    margin: 16px 0;
  }
}
</style>
