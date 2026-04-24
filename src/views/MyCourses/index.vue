<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { MyCoursesService } from "@/services/services/MyCourses.service";
import { FilesService } from "@/services/services/Files.service";
import { setError } from "@/utils/helpers";
import type { MyCourseDto } from "@/views/CardTests/courseTypes";

const router = useRouter();
const { t } = useI18n();

const courses = ref<MyCourseDto[]>([]);
const loading = ref(false);

const load = () => {
  loading.value = true;
  MyCoursesService.List()
    .then((res) => {
      courses.value = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    })
    .catch((e) => setError(e))
    .finally(() => (loading.value = false));
};

const openCourse = (c: MyCourseDto) => {
  router.push({ name: "CourseDetail", params: { id: String(c.id) } });
};

const imageUrl = (c: MyCourseDto) =>
  c.imageFileId ? FilesService.buildFileUrl(c.imageFileId, "coursesImage") : "";
const videoThumbUrl = (c: MyCourseDto) =>
  c.videoFileId ? FilesService.buildFileUrl(c.videoFileId, "coursesVideo") : "";

const fmt = (s: string | null) => (s ? new Date(s).toLocaleDateString() : "");

onMounted(load);
</script>

<template>
  <div class="my-courses">
    <div class="page-head">
      <h1 class="page-title">{{ t("courses") }}</h1>
      <p class="page-sub">{{ t("courseInfo") }}</p>
    </div>

    <div v-if="loading" class="loading">
      <v-progress-circular indeterminate color="#16A34A" :size="40" />
    </div>

    <div v-else-if="!courses.length" class="empty-state">{{ t("noCourses") }}</div>

    <div v-else class="grid">
      <div v-for="c in courses" :key="c.id" class="course" @click="openCourse(c)">
        <div class="course__cover" :class="{ 'course__cover--video': c.videoFileId || c.imageFileId }">
          <img v-if="c.imageFileId" :src="imageUrl(c)" alt="cover" />
          <video v-else-if="c.videoFileId" :src="videoThumbUrl(c)" muted preload="metadata" playsinline></video>
          <div v-else class="course__cover-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>

          <div class="course__cover-gradient"></div>

          <div v-if="c.hasPendingSubmission" class="course__badge course__badge--pending">
            {{ t("gradePending") }}
          </div>
          <div v-else-if="c.latestGrade != null" class="course__badge course__badge--grade">
            {{ t("gradeLabel", { grade: c.latestGrade }) }}
          </div>
        </div>

        <div class="course__body">
          <h3 class="course__name">{{ c.name }}</h3>
          <p v-if="c.description" class="course__desc">{{ c.description }}</p>

          <div class="course__progress">
            <div class="course__progress-top">
              <span>{{ Math.round(c.progressPercentage || 0) }}%</span>
            </div>
            <div class="course__progress-track">
              <div class="course__progress-fill" :style="{ width: (c.progressPercentage || 0) + '%' }"></div>
            </div>
          </div>

          <button class="course__btn" @click.stop="openCourse(c)">
            {{ t("openCourse") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$accent: #16A34A;
$accent-soft: #ECFDF5;

.my-courses { animation: fadeIn 0.25s ease; }

.page-head { margin-bottom: 20px;
  @media (max-width: 480px) { margin-bottom: 14px; } }
.page-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: #1F2937; margin: 0;
  @media (max-width: 480px) { font-size: 20px; } }
.page-sub { font-family: 'Poppins', sans-serif; font-size: 13px; color: #6B7280; margin: 2px 0 0; }

.loading { display: flex; align-items: center; justify-content: center; min-height: 220px; }
.empty-state { text-align: center; padding: 60px 20px; font-family: 'Poppins', sans-serif; color: #9CA3AF; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.course {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  &__cover {
    position: relative;
    width: 100%;
    height: 180px;
    background: #1F2937;
    overflow: hidden;

    @media (max-width: 480px) {
      height: 160px;
    }

    img, video {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      display: block;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6B7280;
    }

    &-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.6));
      pointer-events: none;
    }
  }

  &__badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 4px 10px;
    border-radius: 999px;
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 700;
    z-index: 1;

    &--pending {
      background: #FEF3C7;
      color: #D97706;
    }

    &--grade {
      background: $accent-soft;
      color: $accent;
    }
  }

  &__body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;

    @media (max-width: 480px) { padding: 12px 14px 14px; gap: 8px; }
  }

  &__name {
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1F2937;
    margin: 0;
    line-height: 1.3;

    @media (max-width: 480px) { font-size: 14px; }
  }

  &__desc {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #6B7280;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__stats {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  &__stat {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #4B5563;
    background: #F9FAFB;
    padding: 3px 8px;
    border-radius: 6px;

    &--date {
      color: #9CA3AF;
      background: transparent;
    }

    svg {
      color: $accent;
    }
  }

  &__progress {
    &-top {
      display: flex;
      justify-content: flex-end;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: $accent;
      margin-bottom: 4px;
    }

    &-track {
      height: 5px;
      background: #F3F4F6;
      border-radius: 999px;
      overflow: hidden;
    }

    &-fill {
      height: 100%;
      background: $accent;
      border-radius: 999px;
      transition: width 0.3s;
    }
  }

  &__btn {
    margin-top: auto;
    width: 100%;
    padding: 9px 14px;
    border: none;
    border-radius: 8px;
    background: $accent;
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: #15803D; }
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
