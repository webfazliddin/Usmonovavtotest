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
          color="#5D87FF"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  animation: fadeIn 0.4s ease;
}

.loading-card {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

// #1 Grid — desktop 3 ustun
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

// #7 Card shadow qo'shildi
.modern-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  animation: slideIn 0.4s ease both;
  overflow: hidden;
  min-width: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

// #3 Card header border qo'shildi
.card-header {
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E8ECF4;
}

.category-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1F2937; // #2 Kontrastli qora
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

// #4 Border qo'shildi — success/error ranglar ko'rinadi
.stat-box {
  background: #f5f5f7;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px 8px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f2;
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
      color: #EF4444;
    }
  }
}

// #1 Label — 9px -> 11px, #2 rang ochroq
.stat-label {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

// #2 Value rang kontrastli
.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1;
}

.progress-section {
  background: #f5f5f7;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

// #5 Progress label — 10px -> 11px
.progress-label {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

// #6 Foiz raqami — 14px -> 16px
.progress-percentage {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #5D87FF;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #E8ECF4;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #5D87FF;
  border-radius: 8px;
  transition: width 0.4s ease;
}

.card-actions {
  display: flex;
  gap: 8px;
}

// #8 Tugmalar — padding va font kattaroq
.action-btn {
  flex: 1;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  &:active {
    transform: scale(0.98);
  }

  &.primary-btn {
    color: white;
    background: #5D87FF;

    &:hover {
      background: #4A78F0;
    }
  }

  &.continue-btn {
    color: white;
    background: #10B981;

    &:hover {
      background: #0EA472;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// Tablet (1024px) — 2 ustun
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .category-title {
    font-size: 15px;
  }

  .stat-value {
    font-size: 18px;
  }
}

// Mobile (768px) — 2 ustun, kompakt
@media (max-width: 768px) {
  .modern-categories-page {
    padding: 0;
  }

  .loading-card {
    min-height: 180px;
    margin: 12px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }

  .modern-card {
    padding: 12px;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
  }

  .card-header {
    margin-bottom: 10px;
    padding-bottom: 8px;
  }

  .category-title {
    font-size: 14px;
  }

  .stats-grid {
    gap: 6px;
    margin-bottom: 10px;
  }

  .stat-box {
    padding: 8px 6px;
    border-radius: 6px;
  }

  // #9 Mobile label — 7px -> 9px
  .stat-label {
    font-size: 9px;
    margin-bottom: 2px;
  }

  .stat-value {
    font-size: 16px;
  }

  .progress-section {
    padding: 8px 10px;
    margin-bottom: 10px;
    border-radius: 6px;
  }

  .progress-label {
    font-size: 9px;
  }

  .progress-percentage {
    font-size: 14px;
  }

  .progress-bar-container {
    height: 6px;
  }

  // #10 Mobileda tugmalar row qoladi
  .card-actions {
    gap: 6px;
  }

  .action-btn {
    padding: 9px 10px;
    font-size: 11px;
    border-radius: 6px;
    gap: 4px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
}

// Kichik mobil (480px) — 1 ustun
@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }

  .modern-card {
    padding: 14px;
  }

  .category-title {
    font-size: 15px;
    white-space: normal;
  }

  .stat-box {
    padding: 10px 8px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 18px;
  }

  .progress-label {
    font-size: 10px;
  }

  .progress-percentage {
    font-size: 15px;
  }

  .progress-bar-container {
    height: 7px;
  }

  .card-actions {
    gap: 8px;
  }

  .action-btn {
    padding: 10px 14px;
    font-size: 12px;
  }
}

// Juda kichik mobil (375px)
@media (max-width: 375px) {
  .categories-grid {
    padding: 8px;
    gap: 8px;
  }

  .modern-card {
    padding: 12px;
  }

  .category-title {
    font-size: 14px;
  }

  .stat-label {
    font-size: 9px;
  }

  .stat-value {
    font-size: 16px;
  }

  .action-btn {
    padding: 9px 10px;
    font-size: 11px;
  }
}

// Landscape rejim
@media (max-width: 768px) and (orientation: landscape) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 10px;
    gap: 8px;
  }

  .modern-card {
    padding: 10px;
  }

  .category-title {
    font-size: 13px;
  }

  .stat-label {
    font-size: 9px;
  }

  .stat-value {
    font-size: 15px;
  }

  .action-btn {
    font-size: 10px;
    padding: 7px 8px;
  }
}

// Fullscreen dialog
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
