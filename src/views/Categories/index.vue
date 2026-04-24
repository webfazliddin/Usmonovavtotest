<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { useCategories } from "./store/useCategories";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { CategoriesService } from "@/services/services/Categories";

const store = useCategories();
const { categories, categoriesLoading, filter } = storeToRefs(store);

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "categoryName" },
];

const fetchCategoriesPage = (item: any) => {
  router.push({
    name: "EditCategories",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
};

store.fetchCategories();
</script>

<template>
  <div class="modern-admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <button class="modern-btn modern-btn--primary" @click="fetchCategoriesPage({ id: 0 })">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ $t("createCategory") }}</span>
      </button>
    </div>

    <!-- Table Card -->
    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="categories"
        :loading="categoriesLoading"
        :filter="filter"
        @refresh="store.fetchCategories"
        append-action
      >
        <template #actions="{ item }">
          <div class="action-menu">
            <button class="action-btn">
              <DotsVerticalIcon :size="20" />
            </button>
            <v-menu activator="parent" offset="8">
              <div class="modern-menu">
                <button class="menu-item" @click="fetchCategoriesPage(item)">
                  <PencilIcon :size="18" />
                  <span>{{ $t("edit") }}</span>
                </button>
                <DeleteAction
                  :item="item"
                  :service="CategoriesService"
                  @refresh="store.fetchCategories()"
                />
              </div>
            </v-menu>
          </div>
        </template>
      </FormTable>
    </UiParentCard>
  </div>
</template>

<style lang="scss" scoped>
.modern-admin-page {
  animation: fadeIn 0.4s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
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

    svg {
      stroke: currentColor;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.action-menu { position: relative; }

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8F9FC;
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
    background: #F8F9FC;
    color: #5D87FF;
  }

  svg {
    color: currentColor;
    flex-shrink: 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
