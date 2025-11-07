<script setup lang="ts">
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LockIcon, LockOpenIcon } from "vue-tabler-icons";

const router = useRouter();

const cards = ref<any[]>([]);

const fetchCards = async () => {
  // const { data } = await CardService.GetCards();
  CardService.GetCards()
    .then((res) => {
      cards.value = res.data;
    })
    .catch((e) => {
      setError(e);
    });
};

fetchCards();

const fetchCard = (item: any) => {
  if (!item?.isLocked) return;

  router.push({ name: "CardTest", params: { cardId: item.id } });
};
</script>

<template>
  <div class="modern-page">
    <!-- Page Header -->
    <div class="page-header">
      <button class="back-btn" @click="router.back()">
        <span>{{ $t("back") }}</span>
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="modern-cards-grid">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="modern-card-item"
        :class="{ 'modern-card-item--locked': !card.isLocked }"
        @click="fetchCard(card)"
      >
        <div class="card-background">
          <div class="card-overlay"></div>
          <div class="card-content">
            <div class="card-icon">
              <img src="@/assets/images/testIcon.png" alt="Test Icon" />
            </div>
            <h3 class="card-name">{{ card.name }}</h3>
          </div>
        </div>

        <div class="card-footer">
          <div class="level-badge">
            <span class="level-text">{{ card.name }}</span>
          </div>
          <div class="lock-status">
            <LockIcon
              v-if="!card.isLocked"
              :size="20"
              class="lock-icon"
            />
            <LockOpenIcon
              v-else
              :size="20"
              class="unlock-icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modern-page {
  max-width: 1920px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  flex: 1;
  min-width: 0;
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

.back-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  background: #F8F9FC;
  color: #4A90E2;
  border: 1px solid #E8ECF4;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4A90E2;
    color: white;
    border-color: #4A90E2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.modern-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.modern-card-item {
  background: white;
  border-radius: 16px;
  border: 1px solid #E8ECF4;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: scaleIn 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(74, 144, 226, 0.2);
    border-color: #4A90E2;

    .card-overlay {
      opacity: 1;
    }

    .card-content {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &--locked {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(74, 144, 226, 0.08);
    }
  }
}

.card-background {
  position: relative;
  height: 200px;
  background: url("@/assets/images/card-bg.png") no-repeat center/cover;
  overflow: hidden;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  color: white;
  z-index: 2;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.card-name {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #F8F9FC;
  border-top: 1px solid #E8ECF4;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #E8ECF4;
}

.level-text {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #4A90E2;
}

.lock-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #E8ECF4;
}

.lock-icon {
  color: #EF4444;
}

.unlock-icon {
  color: #10B981;
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 1280px) {
  .modern-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 960px) {
  .page-title {
    font-size: 28px;
  }

  .modern-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .card-background {
    height: 180px;
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .back-btn {
    width: 100%;
  }

  .modern-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
