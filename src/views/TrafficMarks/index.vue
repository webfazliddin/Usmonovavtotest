<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import Edit from "./edit.vue";
import { ref, watch } from "vue";
import { useTrafficMarks } from "./store/useTrafficMarks";
import { TrafficMarksService } from "@/services/services/TrafficMarks.service";
import Pagination from "@/components/Pagination.vue";

const store = useTrafficMarks();
const router = useRouter();

const { data, dataLoading, filter } = storeToRefs(store);

const route = useRoute();
const isDialog = ref(false);

const fetchDetail = (item: any) => {
  router.push({
    name: "EditTrafficMarks",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
  isDialog.value = true;
};

store.fetchData();

watch(
  () => route.params.id,
  (val) => {
    if (val) {
      isDialog.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col md="6" cols="12">
        <h2>{{ $t("trafficMarks") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchDetail(0)">
          {{ $t("createTest") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <div class="cards" v-if="!dataLoading">
        <div class="card" v-for="(card, index) in data">
          <div
            class="card--inner"
            :style="{
              backgroundImage: `url(https://api.uatest.uz/api/TrafficMarks/downloadfile?fileName=${card.fileId})`,
            }"
          >
            <div class="card--inner__content">
              <v-btn size="30" icon variant="flat" class="grey100">
                <v-avatar size="22">
                  <DotsVerticalIcon size="20" color="grey100" />
                </v-avatar>
                <v-menu activator="parent">
                  <v-list>
                    <v-list-item
                      value="edit"
                      hide-details
                      min-height="38"
                      @click="fetchDetail(card)"
                    >
                      <v-list-item-title>
                        <v-avatar size="20" class="mr-2">
                          <component
                            :is="PencilIcon"
                            stroke-width="2"
                            size="20"
                          />
                        </v-avatar>
                        {{ $t("edit") }}
                      </v-list-item-title>
                    </v-list-item>
                    <DeleteAction
                      :item="card"
                      :service="TrafficMarksService"
                      @refresh="store.fetchData()"
                    >
                    </DeleteAction>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </div>

          <div class="level">
            <h4>{{ index + 1 }} {{ card.shortName }}</h4>
          </div>
        </div>
      </div>
    </UiParentCard>
    <Pagination :filter="filter" />

    <v-dialog v-model="isDialog" :width="450" persistent>
      <Edit v-model="isDialog" />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.banner-icon {
  width: 2.75rem;
  height: 2.75rem;
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
  }
}
</style>
