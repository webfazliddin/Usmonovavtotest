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

let searchTimeout: NodeJS.Timeout | null = null;

const fetchDetail = (item: any) => {
  router.push({
    name: "EditCardTests",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
  isDialog.value = true;
};

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    filter.value.page = 1;
    store.refreshData();
  }, 500);
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
  <div class="modern-admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">{{ $t("cardTests") }}</h1>
      </div>
      <button class="modern-btn modern-btn--primary" @click="fetchDetail(0)">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ $t("createTest") }}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="search-section">
      <v-text-field
        v-model="filter.search"
        :placeholder="$t('search') + '...'"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        @input="handleSearch"
        class="search-input"
      >
        <template v-slot:prepend-inner>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </template>
      </v-text-field>
    </div>

    <!-- Table Card -->
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
          <div class="action-menu">
            <button class="action-btn">
              <DotsVerticalIcon :size="20" />
            </button>
            <v-menu activator="parent" offset="8">
              <div class="modern-menu">
                <button class="menu-item" @click="fetchDetail(item)">
                  <PencilIcon :size="18" />
                  <span>{{ $t("edit") }}</span>
                </button>
                <DeleteAction
                  :item="item"
                  :service="CardTestsService"
                  @refresh="store.refreshData()"
                />
              </div>
            </v-menu>
          </div>
        </template>
      </FormTable>
    </UiParentCard>

    <v-dialog v-model="isDialog" width="90%" max-width="1200" persistent>
      <Edit v-model="isDialog" @update:model-value="store.refreshData()" />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.modern-admin-page {
  animation: fadeIn 0.4s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.header-left {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 22px;
  }
}

.modern-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &--primary {
    background: #5D87FF;
    color: white;

    &:hover {
      background: #4A73E8;
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      stroke: currentColor;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.search-section {
  margin-bottom: 20px;
}

.search-input {
  max-width: 500px;
  font-family: 'Poppins', sans-serif;

  :deep(.v-field__prepend-inner) {
    padding-top: 8px;

    svg {
      color: #6B7280;
    }
  }

  :deep(.v-field__input) {
    font-size: 14px;
    padding: 12px 0;
  }

  :deep(.v-field__outline) {
    border-radius: 10px;
  }

  :deep(.v-field--focused) {
    .v-field__outline {
      border-color: #5D87FF;
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.action-menu {
  position: relative;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9FAFB;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6B7280;

  &:hover {
    background: #5D87FF;
    color: white;
  }
}

.modern-menu {
  background: white;
  border-radius: 12px;
  padding: 8px;
  min-width: 160px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #1F2937;
  text-align: left;

  &:hover {
    background: #F9FAFB;
    color: #5D87FF;
  }

  svg {
    color: currentColor;
    flex-shrink: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
