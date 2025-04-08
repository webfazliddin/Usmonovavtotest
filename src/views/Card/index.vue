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
  <div class="container">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="my-4">{{ $t("LevelUp") }}</h1>
      <v-btn color="error" @click="router.back()">
        {{ $t("back") }}
      </v-btn>
    </div>
    <p class="mb-4">
      {{ $t("LevelUpText") }}
    </p>
    <div class="cards">
      <div
        class="card"
        v-for="(card, index) in cards"
        @click="fetchCard(card)"
        :class="[
          {
            locked: !card.isLocked,
          },
        ]"
      >
        <div class="card--inner">
          <div class="card--inner__content">
            <div class="title">
              <img src="@/assets/images/testIcon.png" alt="" />
              <h4>{{ card.name }}</h4>
            </div>
          </div>
        </div>
        <div class="level">
          <span> {{ index + 1 }} level </span>
          <LockIcon
            size="25"
            v-if="!card.isLocked"
            color="rgb(var(--v-theme-error))"
          />
          <LockOpenIcon size="16" v-else color="green" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
  line-height: 3rem;
  font-weight: 600;
}

p {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: rgb(var(--v-theme-textSecondary));
}

.cards {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px 10px;

  .card {
    position: relative;
    transition: all 0.4s;
    flex: 0 0 calc(100% / 4 - 8px);
    cursor: pointer;

    &--inner {
      background: url("@/assets/images/card-bg.png") no-repeat center/cover;
      height: 0;
      padding-bottom: 66.25%;
      position: relative;
      overflow: hidden;
      border-radius: 8px;

      &__content {
        position: relative;
        z-index: 2;
        color: #dadada;
        padding: 8px;
        position: absolute;
        bottom: -100%;
        transition: all 0.4s;

        .title {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        img {
          width: 24px;
          height: 24px;
        }
      }

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 1;
        border-radius: 8px;
        opacity: 0;
        transition: all 0.4s;
      }
    }

    .level {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        font-size: 18px;
        font-weight: 500;
      }
    }

    &:hover {
      .card--inner {
        .card--inner__content {
          bottom: 0;
        }

        &::after {
          opacity: 0.4;
        }
      }
    }

    &.locked {
      opacity: 0.7;
    }

    @media screen and (max-width: 1440px) {
      flex: 0 0 calc(100% / 4 - 8px);
    }

    @media screen and (max-width: 960px) {
      flex: 0 0 calc(100% / 3 - 8px);
    }

    @media screen and (max-width: 768px) {
      flex: 0 0 calc(100% / 2 - 8px);
    }

    @media screen and (max-width: 600px) {
      flex: 0 0 calc(100% / 1 - 8px);
    }
  }
}
</style>
