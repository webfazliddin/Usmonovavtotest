<script setup lang="ts">
import { ref } from "vue";
import ExamTest from "@/features/Exam/ExamTest.vue";
import ExamResult from "@/features/Exam/ExamResult.vue";

const currentView = ref<"start" | "exam" | "result">("start");
const attemptId = ref<number | null>(null);

const startExam = () => {
  currentView.value = "exam";
};

const showResult = (id: number) => {
  attemptId.value = id;
  currentView.value = "result";
};

const goBack = () => {
  currentView.value = "start";
  attemptId.value = null;
};
</script>

<template>
  <div class="exam-page">
    <!-- Start Screen -->
    <div v-if="currentView === 'start'" class="start-screen">
      <div class="start-container">
        <!-- Header -->
        <div class="start-header">
          <div class="exam-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 class="start-title">Imtihon</h1>
          <p class="start-subtitle">Haydovchilik guvohnomasi olish uchun imtihon topshiring</p>
        </div>

        <!-- Info Card -->
        <div class="info-card">
          <div class="info-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2>Imtihon haqida ma'lumot</h2>
          </div>

          <div class="info-list">
            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">Savollar soni</span>
                <span class="info-value">20 ta savol</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">O'tish bali</span>
                <span class="info-value">18 ta to'g'ri javob (90%)</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">Vaqt cheklovi</span>
                <span class="info-value">Cheklovsiz</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">Format</span>
                <span class="info-value">Har bir savol uchun bir javob</span>
              </div>
            </div>
          </div>

          <div class="warning-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div class="warning-content">
              <p class="warning-title">Diqqat!</p>
              <p class="warning-text">Imtihonni boshlash uchun tayyor bo'lganingizdan ishonch hosil qiling. Javob berganingizdan keyin ortga qaytib javobingizni o'zgartira olmaysiz.</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="start-actions">
          <button class="start-exam-btn" @click="startExam">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Imtihonni boshlash
          </button>
          <button class="back-btn" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Ortga qaytish
          </button>
        </div>
      </div>
    </div>

    <!-- Exam Test Component -->
    <ExamTest v-if="currentView === 'exam'" @show-result="showResult" />

    <!-- Result Component -->
    <ExamResult v-if="currentView === 'result' && attemptId" :attempt-id="attemptId" @go-back="goBack" />
  </div>
</template>

<style lang="scss" scoped>
.exam-page {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  background: #F8FAFB;
}

.start-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.start-container {
  max-width: 700px;
  width: 100%;
}

.start-header {
  text-align: center;
  margin-bottom: 40px;
}

.exam-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  border-radius: 20px;
  margin-bottom: 24px;

  svg {
    color: white;
  }
}

.start-title {
  font-size: 36px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 12px 0;
}

.start-subtitle {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #F3F4F6;

  svg {
    color: #7C3AED;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #F9FAFB;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #F3F4F6;
    transform: translateX(4px);
  }
}

.info-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;

  svg {
    color: #7C3AED;
  }
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #1F2937;
  font-weight: 600;
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #FEF3C7;
  border: 2px solid #FCD34D;
  border-radius: 12px;
  padding: 20px;

  svg {
    color: #F59E0B;
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 14px;
  font-weight: 700;
  color: #92400E;
  margin: 0 0 8px 0;
}

.warning-text {
  font-size: 14px;
  color: #92400E;
  line-height: 1.6;
  margin: 0;
}

.start-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.start-exam-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.back-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 32px;
  background: white;
  color: #6B7280;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }
}

// Responsive styles
@media (max-width: 768px) {
  .start-screen {
    padding: 20px 16px;
  }

  .start-header {
    margin-bottom: 24px;
  }

  .exam-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    margin-bottom: 16px;

    svg {
      width: 36px;
      height: 36px;
    }
  }

  .start-title {
    font-size: 28px;
  }

  .start-subtitle {
    font-size: 14px;
  }

  .info-card {
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
  }

  .info-header {
    margin-bottom: 20px;
    padding-bottom: 16px;

    svg {
      width: 20px;
      height: 20px;
    }

    h2 {
      font-size: 18px;
    }
  }

  .info-list {
    gap: 12px;
    margin-bottom: 20px;
  }

  .info-item {
    padding: 12px;
    border-radius: 10px;
  }

  .info-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 14px;
  }

  .warning-box {
    padding: 16px;
    border-radius: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .warning-title {
    font-size: 13px;
  }

  .warning-text {
    font-size: 13px;
  }

  .start-exam-btn {
    padding: 14px 24px;
    font-size: 15px;
    border-radius: 10px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .back-btn {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 10px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
