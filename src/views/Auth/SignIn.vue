<script setup lang="ts">
import LeftInfoPanel from "./components/LeftInfoPanel.vue";
import RightLoginPanel from "./components/RightLoginPanel.vue";
</script>

<template>
  <div class="auth-wrapper">
    <!-- Main Container -->
    <v-container fluid class="auth-container">
      <v-row class="auth-row" align="center" justify="center">
        <!-- Left Side - Info Panel (Desktop Only) -->
        <v-col cols="12" md="6" lg="6" class="d-none d-md-flex">
          <LeftInfoPanel />
        </v-col>

        <!-- Right Side - Login Panel -->
        <v-col cols="12" md="6" lg="5" xl="4">
          <RightLoginPanel />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
// Auth Wrapper
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #f5f7fa;
  position: relative;
  overflow: hidden;
}

// Container
.auth-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  padding: 24px;
}

.auth-row {
  min-height: calc(100vh - 48px);
}

// Responsive Design
@media (max-width: 959px) {
  .auth-container {
    padding: 20px;
  }

  .auth-row {
    min-height: auto;
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
}
</style>
