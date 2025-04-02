<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTrafficMarks } from "./store/useTrafficMarks";
import Pagination from "@/components/Pagination.vue";

const store = useTrafficMarks();

const { data, dataLoading, filter } = storeToRefs(store);

store.fetchData();
</script>

<template>
  <div class="container">
    <v-row class="mb-4">
      <v-col md="6" cols="12">
        <h2>{{ $t("trafficMarksUser") }}</h2>
      </v-col>
    </v-row>

    <div class="cards" v-if="!dataLoading">
      <div class="card" v-for="(card, index) in data">
        <div
          class="card--inner"
          :style="{
            backgroundImage: `url(https://api.uatest.uz/api/TrafficMarks/downloadfile?fileName=${card.fileId})`,
          }"
        >
          <div class="card--inner__content"></div>
        </div>

        <div class="level">
          <h4>{{ index + 1 }} {{ card.shortName }}</h4>
        </div>
      </div>
    </div>
    <Pagination :filter="filter" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .card {
    position: relative;

    transition: all 0.4s;
    flex: 0 0 calc(100% / 5 - 8px);
    cursor: pointer;

    &--inner {
      height: 0;
      padding-bottom: 56.25%;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      &__content {
        position: relative;
        z-index: 2;
        color: #dadada;
        padding: 8px;
        position: absolute;
        bottom: 0;
        right: 0;
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
      margin-top: 0.5rem;

      span {
        font-size: 18px;
        font-weight: 500;
      }
    }

    &:hover {
      .card--inner {
        &::after {
          opacity: 0.4;
        }
      }
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
