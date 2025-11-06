<script setup lang="ts">
import { MyCategories } from "@/views/MyCategories/types";
import { toRefs } from "vue";
import {
  FileDescriptionIcon,
  PercentageIcon,
  UserCheckIcon,
} from "vue-tabler-icons";

interface IProps {
  item?: MyCategories;
  canContiniue?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  canContiniue: true,
});

const { item } = toRefs(props);
const emits = defineEmits(["start", "continue"]);
</script>

<template>
  <div class="modern-category-card">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <!-- Progress Stat -->
      <div
        v-if="item.progressPercentage"
        class="stat-item"
        :class="{ 'stat-item--success': item.progressPercentage >= 80 }"
      >
        <div class="stat-icon">
          <PercentageIcon :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ Math.round(item.progressPercentage) }}%</div>
          <div class="stat-label">
            {{ item.progressPercentage >= 80 ? $t("goodJob") : $t("needsImprovement") }}
          </div>
        </div>
      </div>

      <!-- Questions Count -->
      <div v-if="item?.questionsCount" class="stat-item">
        <div class="stat-icon">
          <FileDescriptionIcon :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.questionsCount }}</div>
          <div class="stat-label">{{ $t("testCount", { count: item.questionsCount }) }}</div>
        </div>
      </div>

      <!-- Answered Count -->
      <div v-if="item?.answeredCount" class="stat-item">
        <div class="stat-icon">
          <UserCheckIcon :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.answeredCount }}</div>
          <div class="stat-label">{{ $t("answeredCount", { count: item.answeredCount }) }}</div>
        </div>
      </div>

      <!-- Correct Answers -->
      <div v-if="item?.correctAnswerCount" class="stat-item stat-item--success">
        <div class="stat-icon">
          <span class="check-icon">✓</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.correctAnswerCount }}</div>
          <div class="stat-label">{{ $t("correctAnswerCount", { count: item.correctAnswerCount }) }}</div>
        </div>
      </div>

      <!-- No Data -->
      <div v-if="!item.progressPercentage && !item.questionsCount && !item.answeredCount && !item.correctAnswerCount" class="stat-item stat-item--empty">
        <div class="stat-icon">
          <span class="alert-icon">!</span>
        </div>
        <div class="stat-content">
          <div class="stat-label">Ma'lumot topilmadi!</div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p v-if="item?.description" class="category-description">
      {{ item.description }}
    </p>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="modern-btn modern-btn--primary" @click="emits('start', item)">
        <span>{{ $t("startTest") }}</span>
      </button>
      <button
        v-if="canContiniue"
        class="modern-btn modern-btn--secondary"
        @click="emits('continue', item)"
      >
        <span>{{ $t("continueTest") }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-category-card {
  background: linear-gradient(135deg, #4A90E2 0%, #2563EB 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(74, 144, 226, 0.3);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.02);
  }

  &--success {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
  }

  &--empty {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  .check-icon {
    font-size: 22px;
    font-weight: bold;
  }

  .alert-icon {
    font-size: 22px;
    font-weight: bold;
  }
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  line-height: 1.2;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.9;
  font-family: 'Poppins', sans-serif;
  line-height: 1.3;
}

.category-description {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.5);
  font-family: 'Poppins', sans-serif;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.modern-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.97);
  }

  &--primary {
    background: white;
    color: #4A90E2;

    &:hover {
      background: #F8F9FC;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &--secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }

  .stat-value {
    font-size: 20px;
  }

  .action-buttons {
    flex-direction: column;

    .modern-btn {
      width: 100%;
    }
  }
}
</style>
