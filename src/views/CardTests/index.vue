<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import Edit from "./edit.vue";
import { ref, watch } from "vue";
import { useCardTests } from "./store/useCategories";
import { CardTestsService } from "@/services/services/CardTests.service";

const store = useCardTests();
const router = useRouter();

const { data, dataLoading, filter } = storeToRefs(store);

const route = useRoute();
const isDialog = ref(false);

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "shortName", label: "shortName" },
  { key: "fullName", label: "fullName" },
];

const fetchDetail = (item: any) => {
  router.push({
    name: "EditCardTests",
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
  <div class="admin-page-container">
    <v-row class="page-header">
      <v-col md="6" cols="12" class="header-left">
        <h2 class="page-title">{{ $t("cardTests") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="header-right">
        <v-btn color="info" class="create-button" @click="fetchDetail(0)">
          {{ $t("createTest") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="data"
        :loading="dataLoading"
        :filter="filter"
        @refresh="store.fetchData"
        append-action
      >
        <template #actions="{ item }">
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
                  @click="fetchDetail(item)"
                >
                  <v-list-item-title>
                    <v-avatar size="20" class="mr-2">
                      <component :is="PencilIcon" stroke-width="2" size="20" />
                    </v-avatar>
                    {{ $t("edit") }}
                  </v-list-item-title>
                </v-list-item>
                <DeleteAction
                  :item="item"
                  :service="CardTestsService"
                  @refresh="store.fetchData()"
                >
                </DeleteAction>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </FormTable>
    </UiParentCard>

    <v-dialog v-model="isDialog" width="90%" persistent>
      <Edit v-model="isDialog" @update:model-value="store.refreshData()" />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.admin-page-container {
  width: 100%;
  max-width: 100%;
}

.page-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.create-button {
  min-width: 140px;
}

// Tablet styles
@media (max-width: 960px) {
  .page-title {
    font-size: 22px;
  }

  .create-button {
    min-width: 120px;
  }
}

// Mobile styles
@media (max-width: 600px) {
  .page-header {
    margin-bottom: 12px;
  }

  .header-left,
  .header-right {
    padding: 8px 12px !important;
  }

  .page-title {
    font-size: 20px;
  }

  .header-right {
    justify-content: flex-start;
    margin-top: -8px;
  }

  .create-button {
    width: 100%;
    max-width: 100%;
  }
}

// Small mobile
@media (max-width: 375px) {
  .page-title {
    font-size: 18px;
  }
}
</style>
