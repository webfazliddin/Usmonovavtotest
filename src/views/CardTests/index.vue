<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import UiParentCard from "@/components/UiParentCard.vue";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { IFields } from "@/models/basic";
import { useCourses } from "./store/useCourses";
import { CoursesService } from "@/services/services/Courses.service";
import { FilesService } from "@/services/services/Files.service";

const router = useRouter();
const store = useCourses();
const { courses, coursesLoading, filter } = storeToRefs(store);

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "courseName" },
  { key: "description", label: "courseDescription" },
  { key: "testsCount", label: "courseTests" },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const openEdit = (item: any) => {
  router.push({
    name: "EditCardTests",
    params: { id: item?.id ? item.id : 0 },
  });
};

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filter.value.page = 1;
    store.refresh();
  }, 500);
};

const previewThumb = (row: any) =>
  row.imageFileId
    ? FilesService.buildFileUrl(row.imageFileId, "coursesImage")
    : row.videoFileId
    ? FilesService.buildFileUrl(row.videoFileId, "coursesVideo")
    : null;

onMounted(() => store.refresh());
</script>

<template>
  <div class="kurslar-admin">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">{{ $t("cardTest") }}</h1>
        <p class="page-subtitle">{{ $t("courseInfo") }}</p>
      </div>
      <button class="modern-btn modern-btn--primary" @click="openEdit({ id: 0 })">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ $t("createCourse") }}</span>
      </button>
    </div>

    <div class="filters-row">
      <v-text-field
        v-model="filter.search"
        :placeholder="$t('search') + '...'"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        @input="handleSearch"
        class="search-input"
      />
    </div>

    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="courses"
        :loading="coursesLoading"
        :filter="filter"
        @refresh="store.refresh"
        append-action
      >
        <template #name="{ item }">
          <td class="table-body-cell">
            <div class="cell-course">
              <div class="cell-course__thumb" :class="{ 'has-thumb': previewThumb(item) }">
                <img v-if="item.imageFileId" :src="previewThumb(item)!" alt="" />
                <svg v-else-if="!item.videoFileId" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
                <span v-else class="cell-course__thumb-dot"></span>
              </div>
              <div class="cell-course__body">
                <div class="cell-course__name">{{ item.name }}</div>
              </div>
            </div>
          </td>
        </template>
        <template #description="{ item }">
          <td class="table-body-cell">
            <span class="text-muted">{{ item.description || "—" }}</span>
          </td>
        </template>

        <template #actions="{ item }">
          <div class="action-menu">
            <button class="action-btn">
              <DotsVerticalIcon :size="20" />
            </button>
            <v-menu activator="parent" offset="8">
              <div class="modern-menu">
                <button class="menu-item" @click="openEdit(item)">
                  <PencilIcon :size="18" />
                  <span>{{ $t("edit") }}</span>
                </button>
                <DeleteAction
                  :item="item"
                  :service="CoursesService"
                  @refresh="store.refresh()"
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
.kurslar-admin { animation: fadeIn 0.25s ease; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;

  @media (max-width: 480px) { font-size: 20px; }
}

.page-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: #6B7280;
  margin: 2px 0 0;
}

.modern-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &--primary {
    background: #5D87FF;
    color: white;
    &:hover { background: #4A73E8; }
    svg { stroke: currentColor; }
  }

  @media (max-width: 768px) { width: 100%; justify-content: center; }
}

.filters-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  max-width: 420px;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) { max-width: 100%; }
}

.cell-course {
  display: flex;
  align-items: center;
  gap: 10px;

  &__thumb {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #EFF4FF;
    color: #5D87FF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    &.has-thumb {
      background: #1F2937;
    }

    &-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
  }
}

.text-muted {
  color: #6B7280;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}

.action-menu { position: relative; }

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
  color: #6B7280;

  &:hover { background: #5D87FF; color: white; }
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
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: #1F2937;
  text-align: left;

  &:hover { background: #F9FAFB; color: #5D87FF; }
  svg { color: currentColor; flex-shrink: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
