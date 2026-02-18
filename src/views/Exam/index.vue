<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const startExam = () => {
  router.push("/exam-test");
};
</script>

<template>
  <div class="start-screen">
    <div class="start-container">
      <!-- Header -->
      <div class="start-header">
        <div class="exam-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
        </div>
        <h1 class="start-title">Imtihon</h1>
        <p class="start-subtitle">Haydovchilik guvohnomasi olish uchun imtihon topshiring</p>
      </div>

      <!-- Info Grid -->
      <div class="info-grid">
        <div class="info-item">
          <span class="info-value">20</span>
          <span class="info-label">Savollar</span>
        </div>
        <div class="info-item">
          <span class="info-value info-value--green">90%</span>
          <span class="info-label">O'tish bali</span>
        </div>
        <div class="info-item">
          <span class="info-value">&#8734;</span>
          <span class="info-label">Vaqt</span>
        </div>
        <div class="info-item">
          <span class="info-value">1</span>
          <span class="info-label">Javob</span>
        </div>
      </div>

      <!-- Warning -->
      <div class="warning-line">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Javob berganingizdan keyin ortga qaytib o'zgartira olmaysiz</span>
      </div>

      <!-- Actions -->
      <button class="start-exam-btn" @click="startExam">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Imtihonni boshlash
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.start-screen {
  font-family: 'Poppins', sans-serif;
  height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-container {
  max-width: 420px;
  width: 100%;
}

.start-header {
  text-align: center;
  margin-bottom: 28px;
}

.exam-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #5D87FF;
  border-radius: 14px;
  margin-bottom: 16px;

  svg {
    color: white;
  }
}

.start-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 6px 0;
}

.start-subtitle {
  font-size: 14px;
  color: #9CA3AF;
  margin: 0;
  line-height: 1.4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.info-item {
  background: white;
  border-radius: 12px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-value {
  font-size: 20px;
  font-weight: 800;
  color: #1F2937;

  &--green {
    color: #10B981;
  }
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.warning-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #FEF3C7;
  border-radius: 10px;
  margin-bottom: 20px;

  svg {
    color: #F59E0B;
    flex-shrink: 0;
  }

  span {
    font-size: 12px;
    color: #92400E;
    line-height: 1.4;
  }
}

.start-exam-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  background: #5D87FF;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 480px) {
  .start-screen {
    padding: 16px;
  }

  .start-header {
    margin-bottom: 20px;
  }

  .exam-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 12px;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  .start-title {
    font-size: 22px;
  }

  .start-subtitle {
    font-size: 13px;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }

  .info-item {
    padding: 12px 8px;
  }

  .info-value {
    font-size: 20px;
  }

  .info-label {
    font-size: 11px;
  }

  .warning-line {
    padding: 8px 12px;
    margin-bottom: 16px;

    span {
      font-size: 11px;
    }
  }

}
</style>
