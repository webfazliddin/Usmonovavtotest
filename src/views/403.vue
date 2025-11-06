<template>
  <div class="forbidden-page">
    <div class="forbidden-content">
      <img src="@/assets/images/403.svg" alt="403 Forbidden" class="forbidden-image" />
      <v-btn flat color="success" class="forbidden-button" to="/">
        <svg class="button-icon" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.49992 14.6667H10.4999C13.8333 14.6667 15.1666 13.3333 15.1666 10V6C15.1666 2.66667 13.8333 1.33334 10.4999 1.33334H6.49992C3.16659 1.33334 1.83325 2.66667 1.83325 6V10C1.83325 13.3333 3.16659 14.6667 6.49992 14.6667Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.50018 10.2533H9.78018C10.9135 10.2533 11.8335 9.33334 11.8335 8.2C11.8335 7.06667 10.9135 6.14667 9.78018 6.14667H5.26685"
            stroke="white"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M6.21341 7.18L5.16675 6.12667L6.21341 5.08" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ $t("goHome") }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.forbidden-page {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  padding: 20px;
}

.forbidden-content {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forbidden-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  display: block;
  margin: 0 auto 24px;
}

.forbidden-button {
  margin-bottom: 16px;
}

.button-icon {
  margin-right: 8px;
}

// Tablet styles
@media (max-width: 768px) {
  .forbidden-image {
    max-width: 400px;
    margin-bottom: 20px;
  }
}

// Mobile styles
@media (max-width: 480px) {
  .forbidden-page {
    padding: 16px;
  }

  .forbidden-image {
    max-width: 280px;
    margin-bottom: 16px;
  }

  .forbidden-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>
