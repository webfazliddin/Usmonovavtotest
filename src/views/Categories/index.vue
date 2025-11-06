<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
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

.header-left {
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

  @media (max-width: 768px) {
    font-size: 24px;
  }
}

.page-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  color: #6B7280;
  margin: 0;
}

.modern-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
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
    background: #4A90E2;
    color: white;

    &:hover {
      background: #2563EB;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
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

.action-menu {
  position: relative;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8F9FC;
  border: 1px solid #E8ECF4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6B7280;

  &:hover {
    background: #4A90E2;
    border-color: #4A90E2;
    color: white;
  }
}

.modern-menu {
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
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
  color: #374151;
  text-align: left;

  &:hover {
    background: #F8F9FC;
    color: #4A90E2;
  }

  svg {
    color: currentColor;
    flex-shrink: 0;
  }
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
</style>
