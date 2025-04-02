<script setup lang="ts">
import { CardService } from "@/services/services/Cards.service";
import { ref } from "vue";
import { LockIcon, LockOpenIcon } from "vue-tabler-icons";

const cards = ref<any[]>([]);

const fetchCards = async () => {
  const { data } = await CardService.GetCards();

  cards.value = data;
};

fetchCards();
</script>

<template>
  <div class="container">
    <h1>Card title</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum illo impedit
      labore accusamus nulla provident sit consequatur omnis deleniti ducimus,
      blanditiis pariatur saepe debitis quod obcaecati corporis? Esse, voluptas
      accusamus?
    </p>
    <div class="cards">
      <div class="card" v-for="(card, index) in cards">
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
            size="16"
            v-if="card.isLogged"
            color="rgb(var(--v-theme-error))"
          />
          <LockOpenIcon size="16" v-else color="rgb(var(--v-theme-info))" />
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
  gap: 8px;

  .card {
    position: relative;

    transition: all 0.4s;
    flex: 0 0 calc(100% / 5 - 8px);
    cursor: pointer;

    &--inner {
      background: url("@/assets/images/card-bg.png") no-repeat center/cover;
      height: 0;
      padding-bottom: 56.25%;
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
      gap: 4px;

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
  }
}
</style>
