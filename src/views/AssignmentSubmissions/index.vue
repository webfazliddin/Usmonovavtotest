<script setup lang="ts">
import { onMounted, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import UiParentCard from "@/components/UiParentCard.vue";
import { AssignmentSubmissionsService } from "@/services/services/AssignmentSubmissions.service";
import { CoursesService } from "@/services/services/Courses.service";
import { FilesService } from "@/services/services/Files.service";
import { setError } from "@/utils/helpers";
import type { ISelectList } from "@/models/basic";

const { t } = useI18n();

const filter = ref({
  page: 1,
  size: 20,
  total: 0,
  courseId: null as number | null,
  status: "all" as "all" | "pending" | "graded",
  onlyLatestPerUser: true,
  search: "",
});

const categories = ref<ISelectList[]>([]);
const rows = ref<any[]>([]);
const loading = ref(false);

const gradeOpen = ref(false);
const gradeLoading = ref(false);
const current = ref<any | null>(null);
const gradeForm = ref({ grade: 0 as number, teacherFeedback: "" });

const buildQuery = () => {
  const parts = [`Page=${filter.value.page}`, `Size=${filter.value.size}`];
  if (filter.value.courseId != null) parts.push(`CourseId=${filter.value.courseId}`);
  if (filter.value.status === "pending") parts.push(`OnlyPending=true`);
  if (filter.value.status === "graded") parts.push(`OnlyGraded=true`);
  if (filter.value.onlyLatestPerUser) parts.push(`OnlyLatestPerUser=true`);
  if (filter.value.search) parts.push(`Search=${encodeURIComponent(filter.value.search)}`);
  return parts.join("&");
};

const load = () => {
  loading.value = true;
  AssignmentSubmissionsService.List(buildQuery())
    .then((res) => {
      let data = res.data?.data ?? [];
      // Fallback: agar backend OnlyGraded ni qo'llamasa, client-side filter
      if (filter.value.status === "graded") {
        data = data.filter((r: any) => r.grade != null);
      }
      rows.value = data;
      filter.value.total = res.data?.totalCount ?? 0;
    })
    .catch((e) => setError(e))
    .finally(() => (loading.value = false));
};

const loadCategories = () => {
  CoursesService.SelectList().then((r) => (categories.value = r.data)).catch(() => {});
};

const openGrade = (row: any) => {
  current.value = row;
  gradeForm.value = {
    grade: row.grade ?? 0,
    teacherFeedback: row.teacherFeedback ?? "",
  };
  gradeOpen.value = true;
};

const saveGrade = async () => {
  if (!current.value) return;
  if (gradeForm.value.grade < 0 || gradeForm.value.grade > 100) {
    notify({ text: t("gradeRangeError"), type: "warn" });
    return;
  }
  gradeLoading.value = true;
  try {
    const res = await AssignmentSubmissionsService.Grade(current.value.id, gradeForm.value);
    notify({ text: t("gradeSaved"), type: "success" });
    const updated = res.data;
    if (updated && current.value) {
      const idx = rows.value.findIndex((r) => r.id === current.value.id);
      if (idx >= 0) {
        rows.value[idx] = { ...rows.value[idx], ...updated };
      }
    }
    gradeOpen.value = false;
    load();
  } catch (e) {
    setError(e as any);
  } finally {
    gradeLoading.value = false;
  }
};

const fileUrl = (fn: string) =>
  FilesService.buildFileUrl(fn, "assignmentSubmissions");

const fmt = (s: string | null) => (s ? new Date(s).toLocaleString() : "");

const changePage = (p: number) => {
  filter.value.page = p;
  load();
};

onMounted(() => {
  loadCategories();
  load();
});
</script>

<template>
  <div class="subs-page">
    <div class="page-head">
      <h1 class="page-title">{{ t("assignmentSubmissions") }}</h1>
    </div>

    <UiParentCard>
      <div class="filters">
        <v-select
          v-model="filter.courseId"
          :items="categories"
          item-title="name"
          item-value="id"
          :placeholder="t('selectCourse')"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="filter-field"
          @update:model-value="(v: any) => { filter.page = 1; load(); }"
        />

        <div class="status-toggle">
          <button
            type="button"
            class="status-toggle__btn"
            :class="{ 'status-toggle__btn--active': filter.status === 'all' }"
            @click="filter.status = 'all'; filter.page = 1; load()"
          >{{ t("allSubmissions") }}</button>
          <button
            type="button"
            class="status-toggle__btn"
            :class="{ 'status-toggle__btn--active': filter.status === 'pending' }"
            @click="filter.status = 'pending'; filter.page = 1; load()"
          >{{ t("pendingSubmissions") }}</button>
          <button
            type="button"
            class="status-toggle__btn"
            :class="{ 'status-toggle__btn--active': filter.status === 'graded' }"
            @click="filter.status = 'graded'; filter.page = 1; load()"
          >{{ t("graded") }}</button>
        </div>

        <v-checkbox
          v-model="filter.onlyLatestPerUser"
          label="Oxirgi urinish"
          hide-details
          density="compact"
          color="#5D87FF"
          @change="() => { filter.page = 1; load(); }"
        />
      </div>

      <div v-if="loading" class="loading">
        <v-progress-circular indeterminate color="#5D87FF" />
      </div>

      <div v-else-if="!rows.length" class="empty-state">
        {{ t("notFound") }}
      </div>

      <div v-else class="rows">
        <div v-for="r in rows" :key="r.id" class="row" @click="openGrade(r)">
          <div class="row__head">
            <div class="row__user">
              <div class="row__user-avatar">{{ (r.userFullName || r.userName || '?').charAt(0) }}</div>
              <div>
                <div class="row__user-name">{{ r.userFullName || r.userName }}</div>
                <div class="row__user-sub">{{ r.courseName }}</div>
              </div>
            </div>
            <div class="row__meta">
              <span class="chip chip--attempt">{{ t("attemptNumber", { n: r.attemptNumber }) }}</span>
              <span v-if="r.grade != null" class="chip chip--grade">{{ t("gradeLabel", { grade: r.grade }) }}</span>
              <span v-else class="chip chip--pending">{{ t("gradePending") }}</span>
            </div>
          </div>

          <div v-if="r.answerText" class="row__text">{{ r.answerText }}</div>
          <a v-if="r.fileId" class="row__file" :href="fileUrl(r.fileId)" target="_blank" rel="noopener" @click.stop>
            📎 {{ r.fileId }}
          </a>
          <div class="row__date">{{ t("submittedAt") }}: {{ fmt(r.submittedAt) }}</div>
        </div>
      </div>

      <div v-if="filter.total > filter.size" class="pagination">
        <v-pagination
          v-model="filter.page"
          :length="Math.ceil(filter.total / filter.size)"
          :total-visible="6"
          rounded="circle"
          @update:model-value="changePage"
        />
      </div>
    </UiParentCard>

    <!-- Grade dialog -->
    <v-dialog v-model="gradeOpen" width="560" max-width="95vw">
      <div class="grade-dialog">
        <div class="grade-dialog__head">
          <h3>{{ t("setGrade") }}</h3>
          <button class="grade-dialog__close" @click="gradeOpen = false">×</button>
        </div>

        <div v-if="current" class="grade-dialog__body">
          <div class="grade-dialog__user">
            <strong>{{ current.userFullName || current.userName }}</strong>
            <span class="muted"> — {{ current.courseName }} • {{ t("attemptNumber", { n: current.attemptNumber }) }}</span>
          </div>

          <div v-if="current.answerText" class="grade-dialog__text">
            {{ current.answerText }}
          </div>
          <a v-if="current.fileId" :href="fileUrl(current.fileId)" target="_blank" rel="noopener" class="grade-dialog__file">
            📎 {{ current.fileId }}
          </a>

          <label class="field-label mt-3">{{ t("gradeLabel", { grade: "" }).replace(": ", "") }} (0-100)</label>
          <v-text-field
            v-model.number="gradeForm.grade"
            type="number"
            min="0"
            max="100"
            variant="outlined"
            density="comfortable"
            hide-details
          />

          <label class="field-label mt-3">{{ t("feedback") }}</label>
          <v-textarea
            v-model="gradeForm.teacherFeedback"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            hide-details
          />
        </div>

        <div class="grade-dialog__footer">
          <button class="footer-btn footer-btn--cancel" @click="gradeOpen = false" :disabled="gradeLoading">
            {{ t("cancel") }}
          </button>
          <button class="footer-btn footer-btn--save" @click="saveGrade" :disabled="gradeLoading">
            <v-progress-circular v-if="gradeLoading" indeterminate size="16" width="2" color="white" />
            <span>{{ t("save") }}</span>
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.subs-page { animation: fadeIn 0.25s ease; }

.page-head { margin-bottom: 20px; }

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;

  @media (max-width: 480px) { font-size: 20px; }
}

.filters {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 10px;
    .filter-field { max-width: 100%; width: 100%; }
    .status-toggle { width: 100%;
      .status-toggle__btn { flex: 1; } }
  }
}

.status-toggle { display: inline-flex; padding: 3px; background: #F3F4F6; border-radius: 10px; gap: 2px; }
.status-toggle__btn { padding: 7px 14px; background: transparent; border: none; border-radius: 7px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  &:hover { color: #5D87FF; }
  &--active { background: white; color: #5D87FF; box-shadow: 0 1px 2px rgba(0,0,0,0.06); } }

.filter-field {
  min-width: 240px;
  font-family: 'Poppins', sans-serif;
}

.loading {
  display: flex; align-items: center; justify-content: center;
  padding: 60px 0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  color: #9CA3AF;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  background: #FAFBFC;
  border: 1px solid #F0F2F5;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: #5D87FF; background: #F5F8FF; }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__user-avatar {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: #EFF4FF;
    color: #5D87FF;
    border-radius: 50%;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 700;
  }

  &__user-name {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
  }

  &__user-sub {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #6B7280;
  }

  &__meta {
    display: flex; gap: 6px; flex-wrap: wrap;
  }

  &__text {
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #1F2937;
    margin-bottom: 6px;
  }

  &__file {
    display: inline-block;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #5D87FF;
    text-decoration: none;
    margin-bottom: 6px;

    &:hover { text-decoration: underline; }
  }

  &__date {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    color: #9CA3AF;
  }
}

.chip {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 700;

  &--attempt {
    color: #6B7280;
    background: white;
  }

  &--grade {
    color: #16A34A;
    background: #DCFCE7;
  }

  &--pending {
    color: #D97706;
    background: #FEF3C7;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.grade-dialog {
  background: white;
  border-radius: 14px;
  padding: 20px;
  max-height: 85vh;
  overflow-y: auto;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;

    h3 {
      font-family: 'Poppins', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #1F2937;
      margin: 0;
    }
  }

  &__close {
    width: 30px;
    height: 30px;
    background: #F3F4F6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: #6B7280;
    font-size: 18px;
    line-height: 1;
  }

  &__user {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #1F2937;
    margin-bottom: 10px;

    .muted { color: #6B7280; font-weight: 400; }
  }

  &__text {
    padding: 10px 12px;
    background: #FAFBFC;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: #1F2937;
    margin-bottom: 8px;
  }

  &__file {
    display: inline-block;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #5D87FF;
    text-decoration: none;
    margin-bottom: 8px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }
}

.field-label {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 6px;
}

.footer-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled { opacity: 0.7; cursor: not-allowed; }

  &--cancel {
    background: #F3F4F6;
    color: #1F2937;
    &:hover:not(:disabled) { background: #E5E7EB; }
  }

  &--save {
    background: #5D87FF;
    color: white;
    min-width: 120px;
    justify-content: center;
    &:hover:not(:disabled) { background: #4A73E8; }
  }
}

.mt-3 { margin-top: 12px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
