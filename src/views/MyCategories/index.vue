<script setup lang="ts">
import { ref } from "vue";
import { MyCategories } from "./types";
import { MyCategoriesService } from "@/services/services/MyCategories";
import UiParentCard from "@/components/UiParentCard.vue";
import VMyCategory from "@/components/VMyCategory.vue";
import { AxiosResponse } from "axios";
import TestProcess from "@/features/Test/TestProcess.vue";
import ResultTest from "@/features/Test/ResultTest.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const myCategories = ref<MyCategories[]>([]);
const loading = ref(false);
const isDialog = ref<boolean>(false);
const isCompleteTestResult = ref<boolean>(false);
const testResultAttempId = ref<number | null>(null);
const continueTest = ref<boolean>(false);
const selectedCategory = ref<MyCategories | null>(null);
const defaultOpenPanels = ref<number[]>([]);

const getMyCategories = () => {
  myCategories.value = [];
  loading.value = true;
  MyCategoriesService.MyCategories()
    .then(
      (
        res: AxiosResponse<{
          categories: MyCategories[];
        }>
      ) => {
        myCategories.value = res.data.categories.sort((a, b) => {
          if (a.attemptId) {
            return 1;
          }
          if (!a.attemptId) {
            return -1;
          }
          return 0;
        });
      }
    )
    .finally(() => {
      loading.value = false;
    });
};

// const showResult = (val: number) => {
//   testResultAttempId.value = val;
//   isCompleteTestResult.value = true;
// };

const openCompleteTest = () => {
  router.push({ name: "CompleteTest" });
};

const toggleCategory = (index: number) => {
  const idx = defaultOpenPanels.value.indexOf(index);
  if (idx > -1) {
    defaultOpenPanels.value.splice(idx, 1);
  } else {
    defaultOpenPanels.value.push(index);
  }
};

getMyCategories();
</script>
<template>
  <div class="modern-categories-page">
    <!-- Loading State -->
    <UiParentCard v-if="loading" class="loading-card">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          color="#4A90E2"
          :size="60"
          :width="5"
        ></v-progress-circular>
      </div>
    </UiParentCard>

    <!-- Categories Grid -->
    <div v-if="!loading && myCategories.length" class="categories-grid">
      <div
        v-for="(item, index) in myCategories"
        :key="item.id"
        class="modern-card"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <!-- Card Header -->
        <div class="card-header">
          <h3 class="category-title">{{ item.name }}</h3>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Savollar soni</div>
            <div class="stat-value">{{ item.questionsCount }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Javob berilganlar</div>
            <div class="stat-value">{{ item.answeredCount || 0 }}</div>
          </div>
          <div class="stat-box success">
            <div class="stat-label">To'g'ri javoblar</div>
            <div class="stat-value">{{ item.correctAnswerCount || 0 }}</div>
          </div>
          <div class="stat-box error">
            <div class="stat-label">Xato javoblar</div>
            <div class="stat-value">{{ (item.answeredCount || 0) - (item.correctAnswerCount || 0) }}</div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">O'zlashtirish foizi</span>
            <span class="progress-percentage">{{ Math.round(item.progressPercentage || 0) }}%</span>
          </div>
          <div class="progress-bar-container">
            <div
              class="progress-bar-fill"
              :style="{ width: `${item.progressPercentage || 0}%` }"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions">
          <button
            class="action-btn primary-btn"
            @click.stop="
              () => {
                isDialog = true;
                selectedCategory = item;
                continueTest = false;
              }
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Testni boshlash
          </button>
          <button
            v-if="item.attemptId"
            class="action-btn continue-btn"
            @click.stop="
              () => {
                isDialog = true;
                selectedCategory = item;
                continueTest = true;
              }
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Davom ettirish
          </button>
        </div>
      </div>
    </div>

    <v-dialog
      class="v-dialogs"
      v-if="isDialog"
      v-model:model-value="isDialog"
      fullscreen
      :transition="false"
      :scrim="false"
    >
      <TestProcess
        v-if="selectedCategory"
        :category="selectedCategory"
        v-model:model-value="isDialog"
        @update:model-value="
          (val) => {
            isDialog = val;
            continueTest = false;
            getMyCategories();
          }
        "
        :continueTest="continueTest"
      />
    </v-dialog>

    <!-- <v-dialog
      v-if="isCompleteTest"
      v-model:model-value="isCompleteTest"
      fullscreen
    >
      <CompleteTest
        v-model:model-value="isCompleteTest"
        @show-result="showResult"
      />
    </v-dialog> -->

    <v-dialog
      v-if="isCompleteTestResult && testResultAttempId"
      v-model:model-value="isCompleteTestResult"
      fullscreen
    >
      <ResultTest
        v-if="testResultAttempId"
        v-model:model-value="isCompleteTestResult"
        :attempId="testResultAttempId"
        @update:model-value="getMyCategories"
      />
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.modern-categories-page {
  max-width: 1920px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  color: #6B7280;
  margin: 0;
}

.loading-card {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-text {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.modern-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #E8ECF4;
  padding: 20px;
  transition: all 0.3s ease;
  animation: slideIn 0.4s ease both;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.card-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #E8ECF4;
}

.category-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-box {
  background: #F8FAFB;
  border: 1px solid #E8ECF4;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: #F0F4F8;
    transform: translateY(-1px);
  }

  &.success {
    background: #F0FDF4;
    border-color: #BBF7D0;

    .stat-value {
      color: #16A34A;
    }
  }

  &.error {
    background: #FEF2F2;
    border-color: #FECACA;

    .stat-value {
      color: #DC2626;
    }
  }
}

.stat-label {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.progress-section {
  background: #F8FAFB;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.progress-percentage {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #5D87FF;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background: #E8ECF4;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5D87FF 0%, #4A7FCC 100%);
  border-radius: 10px;
  transition: width 0.4s ease;
  box-shadow: 0 0 10px rgba(93, 135, 255, 0.3);
}

.card-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }

  &.primary-btn {
    color: white;
    background: linear-gradient(135deg, #5D87FF 0%, #4A7FCC 100%);
    box-shadow: 0 4px 12px rgba(93, 135, 255, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(93, 135, 255, 0.4);
    }
  }

  &.continue-btn {
    color: white;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Tablet styles
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }
}

// Mobile styles
@media (max-width: 768px) {
  .modern-categories-page {
    padding: 0;
  }

  .page-header {
    margin-bottom: 20px;
    padding: 16px;
    background: white;
    border-bottom: 1px solid #E8ECF4;
  }

  .page-title {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .loading-card {
    min-height: 250px;
    margin: 16px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .modern-card {
    padding: 16px;
    border-radius: 10px;

    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
  }

  .card-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .category-title {
    font-size: 17px;
    line-height: 1.4;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-box {
    padding: 10px;
    border-radius: 6px;

    &:hover {
      transform: none;
    }
  }

  .stat-label {
    font-size: 10px;
    margin-bottom: 3px;
  }

  .stat-value {
    font-size: 20px;
  }

  .progress-section {
    padding: 10px;
    margin-bottom: 16px;
    border-radius: 6px;
  }

  .progress-header {
    margin-bottom: 6px;
  }

  .progress-label {
    font-size: 11px;
  }

  .progress-percentage {
    font-size: 16px;
  }

  .progress-bar-container {
    height: 8px;
  }

  .card-actions {
    gap: 10px;
  }

  .action-btn {
    padding: 10px 16px;
    font-size: 13px;
    border-radius: 6px;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      transform: none;
    }

    &:active {
      transform: scale(0.97);
    }
  }
}

// Small mobile (iPhone SE, small Android phones)
@media (max-width: 375px) {
  .page-header {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .categories-grid {
    padding: 12px;
    gap: 10px;
  }

  .modern-card {
    padding: 14px;
  }

  .category-title {
    font-size: 16px;
  }

  .stats-grid {
    gap: 6px;
  }

  .stat-box {
    padding: 8px;
  }

  .stat-label {
    font-size: 9px;
  }

  .stat-value {
    font-size: 18px;
  }

  .progress-percentage {
    font-size: 15px;
  }

  .action-btn {
    padding: 9px 14px;
    font-size: 12px;
    gap: 6px;
  }
}

// Landscape mode for mobile
@media (max-width: 768px) and (orientation: landscape) {
  .page-header {
    padding: 10px 16px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 12px 16px;
  }

  .modern-card {
    padding: 12px;
  }

  .category-title {
    font-size: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Fullscreen dialog styles (unscoped to affect v-dialog)
:deep(.v-dialog--fullscreen) {
  .v-overlay__content {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
</style>

<style>
/* Global fullscreen dialog fix */
.v-dialog.v-dialog--fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
}

.v-dialog.v-dialog--fullscreen .v-overlay__content {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
