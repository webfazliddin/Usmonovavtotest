<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuestions } from "./store/useQuestions";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import FormTable from "@/components/form/FormTable.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import { IFields } from "@/models/basic";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { QuestionsService } from "@/services/services/Questions";
import BackBtn from "@/components/form/BackBtn.vue";

const store = useQuestions();
const { questions, questionsLoading, filter, categories } = storeToRefs(store);

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "questionText", label: "questionText" },
  { key: "description", label: "description" },
];

const fetchQuestionPage = (item: any) => {
  router.push({
    name: "EditQuestion",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
};

store.fetchCategories();
store.fetchQuestions();
</script>

<template>
  <div class="modern-admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <button class="modern-btn modern-btn--primary" @click="fetchQuestionPage(0)">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ $t("createTest") }}</span>
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-wrapper">
        <FormInput
          :placeholder="$t('search')"
          v-model:model-value="filter.Search"
          @appendInner="store.fetchQuestions"
          :clearIcon="false"
        />
      </div>
      <div class="filter-wrapper">
        <FormSelect
          v-model:model-value="filter.CategoryId"
          :list="categories"
          itemValue="id"
          itemTitle="name"
          @update:model-value="store.fetchQuestions"
        />
      </div>
    </div>

    <!-- Table Card -->
    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="questions"
        :loading="questionsLoading"
        :filter="filter"
        append-action
        @refresh="store.fetchQuestions"
      >
        <template #actions="{ item }">
          <div class="action-menu">
            <button class="action-btn">
              <DotsVerticalIcon :size="20" />
            </button>
            <v-menu activator="parent" offset="8">
              <div class="modern-menu">
                <button class="menu-item" @click="fetchQuestionPage(item)">
                  <PencilIcon :size="18" />
                  <span>{{ $t("edit") }}</span>
                </button>
                <DeleteAction
                  :item="item"
                  :service="QuestionsService"
                  @refresh="store.fetchQuestions()"
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

.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
}

.filter-wrapper {
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
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
