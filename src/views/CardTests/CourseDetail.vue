<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { MyCoursesService } from "@/services/services/MyCourses.service";
import { MyLessonsService } from "@/services/services/MyLessons.service";
import { CoursesService } from "@/services/services/Courses.service";
import { CardTestsService } from "@/services/services/CardTests.service";
import { FilesService } from "@/services/services/Files.service";
import { AssignmentSubmissionsService } from "@/services/services/AssignmentSubmissions.service";
import { QuestionsService } from "@/services/services/Questions";
import { MyAttemptsService, type AttemptItem } from "@/services/services/MyAttempts.service";
import { setError } from "@/utils/helpers";
import type { MyLessonDto } from "./lessonTypes";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const id = computed(() => String(route.params.id));

const course = ref<any>(null);
const lessons = ref<MyLessonDto[]>([]);
const activeLesson = ref<MyLessonDto | null>(null);
const tests = ref<any[]>([]);
const submissions = ref<any[]>([]);
const courseLoading = ref(false);
const lessonLoading = ref(false);

type MainTab = "video" | "theory" | "test" | "assignment" | "attempts";
const activeTab = ref<MainTab>("video");
const selectedTestId = ref<number | null>(null);
const sidebarOpen = ref(false);

// --- Attempts ---
const courseAttempts = ref<AttemptItem[]>([]);
const lessonAttempts = ref<AttemptItem[]>([]);
const attemptsLoading = ref(false);

const fetchCourseAttempts = () => {
  attemptsLoading.value = true;
  MyAttemptsService.ByCourse(id.value)
    .then((res) => {
      const d = res.data;
      courseAttempts.value = Array.isArray(d) ? d : d?.data ?? [];
    })
    .catch(() => (courseAttempts.value = []))
    .finally(() => (attemptsLoading.value = false));
};

const fetchLessonAttempts = (lessonId: number) => {
  MyAttemptsService.ByLesson(lessonId)
    .then((res) => {
      const d = res.data;
      lessonAttempts.value = Array.isArray(d) ? d : d?.data ?? [];
    })
    .catch(() => (lessonAttempts.value = []));
};

const scoreClass = (pct: number) => {
  if (pct >= 70) return "score--good";
  if (pct >= 50) return "score--mid";
  return "score--bad";
};

const openAttemptResult = (attemptId: number) => {
  router.push({ name: "CardResultPage", params: { attemptId } });
};

const resumeAttempt = (attempt: AttemptItem) => {
  if (!attempt.cardTestId) return;
  router.push({ name: "CardTest", params: { cardId: attempt.cardTestId } });
};

const selectedTest = computed(() =>
  tests.value.find((t) => t.id === selectedTestId.value) ?? null,
);

const videoUrl = computed(() =>
  activeLesson.value?.videoFileId
    ? FilesService.buildFileUrl(activeLesson.value.videoFileId, "lessonsVideo")
    : "",
);
const resourceUrl = computed(() =>
  activeLesson.value?.resourceFileId
    ? FilesService.buildFileUrl(activeLesson.value.resourceFileId, "lessonsResource")
    : "",
);
const assignmentUrl = computed(() =>
  activeLesson.value?.assignmentFileId
    ? FilesService.buildFileUrl(activeLesson.value.assignmentFileId, "lessonsAssignment")
    : "",
);

const overallProgress = computed(() => {
  const c = course.value;
  if (!c) return 0;
  if (c.lessonsCount && c.completedLessonsCount != null) {
    return Math.round((c.completedLessonsCount / c.lessonsCount) * 100);
  }
  return Math.round(c.progressPercentage || 0);
});

const tabStatus = computed(() => {
  const l = activeLesson.value;
  return {
    video: !!l?.videoFileId,
    theory: !!(l?.resourceText || l?.resourceFileId),
    test: tests.value.length > 0,
    assignment: !!(l?.assignmentText || l?.assignmentFileId),
  };
});

// --- Submission dialog ---
const submitOpen = ref(false);
const submitLoading = ref(false);
const submitUploading = ref(false);
const submitData = ref({
  answerText: "",
  comment: "",
  file: null as File | null,
  fileName: "",
});

const openSubmit = () => {
  submitOpen.value = true;
  submitData.value = { answerText: "", comment: "", file: null, fileName: "" };
};

const onPickSubmitFile = (e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0] ?? null;
  submitData.value.file = f;
  submitData.value.fileName = f?.name ?? "";
};

const sendSubmission = async () => {
  if (!activeLesson.value) return;
  if (activeLesson.value.latestGrade != null) {
    notify({ text: t("alreadyGradedCannotSubmit"), type: "warn" });
    submitOpen.value = false;
    return;
  }
  if (!submitData.value.file && !submitData.value.answerText.trim()) {
    notify({ text: t("fieldNotEmpty"), type: "warn" });
    return;
  }
  submitLoading.value = true;
  try {
    let fileId: string | null = null;
    if (submitData.value.file) {
      submitUploading.value = true;
      const fd = new FormData();
      fd.append("file", submitData.value.file);
      const r = await FilesService.PostFiles(fd);
      fileId = r.data?.fileName;
      submitUploading.value = false;
    }
    await AssignmentSubmissionsService.Post({
      lessonId: activeLesson.value.id,
      fileId,
      answerText: submitData.value.answerText || null,
      comment: submitData.value.comment || null,
    });
    notify({ text: t("assignmentSubmitted"), type: "success" });
    submitOpen.value = false;
    fetchMySubmissions();
  } catch (e) {
    setError(e as any);
  } finally {
    submitLoading.value = false;
    submitUploading.value = false;
  }
};

// --- Data fetching ---
const fetchCourse = async () => {
  courseLoading.value = true;
  try {
    const res = await MyCoursesService.GetById(id.value).catch(() =>
      CoursesService.GetById(id.value),
    );
    course.value = res.data;
  } catch (e) {
    setError(e as any);
  } finally {
    courseLoading.value = false;
  }
};

const fetchLessons = async () => {
  try {
    const res = await MyLessonsService.ListByCourse(id.value);
    const data = res.data;
    lessons.value = Array.isArray(data) ? data : data?.data ?? [];
    if (lessons.value.length && !activeLesson.value) {
      selectLesson(lessons.value[0]);
    }
  } catch (e) {
    lessons.value = [];
  }
};

const selectLesson = (l: MyLessonDto) => {
  activeLesson.value = l;
  selectedTestId.value = null;
  loadLessonContext(l.id);
  fetchLessonAttempts(l.id);
  if (window.innerWidth < 960) sidebarOpen.value = false;
};

const loadLessonContext = async (lessonId: number) => {
  lessonLoading.value = true;
  try {
    // refresh lesson detail
    const r = await MyLessonsService.GetById(lessonId).catch(() => null);
    if (r?.data) {
      activeLesson.value = r.data;
      const idx = lessons.value.findIndex((l) => l.id === lessonId);
      if (idx >= 0) lessons.value[idx] = r.data;
    }
    // load tests for this lesson
    const tRes = await CardTestsService.GetCardTests(
      `Page=1&Size=100&LessonId=${lessonId}`,
    );
    tests.value = tRes.data?.data ?? [];
    if (tests.value.length) {
      selectedTestId.value = tests.value[0].id;
    }
    fetchMySubmissions();
  } finally {
    lessonLoading.value = false;
  }
};

const fetchMySubmissions = () => {
  if (!activeLesson.value) {
    submissions.value = [];
    return;
  }
  AssignmentSubmissionsService.My({ lessonId: activeLesson.value.id })
    .then((res) => {
      const d = res.data;
      submissions.value = Array.isArray(d) ? d : d?.data ?? [];
    })
    .catch(() => (submissions.value = []));
};

// --- Inline test-taker ---
interface Choice { id: number; choiceText: string; isCorrect?: boolean; }
interface Question { id: number; questionText: string; fileId?: string | null; choices: Choice[]; }

const testOpen = ref(false);
const testLoading = ref(false);
const testQuestions = ref<Question[]>([]);
const currentQIdx = ref(0);
const userAnswers = ref<Record<number, number>>({});
const testFinished = ref(false);

const currentQuestion = computed(() =>
  testQuestions.value[currentQIdx.value] ?? null,
);

const testScore = computed(() => {
  let correct = 0;
  for (const q of testQuestions.value) {
    const answerId = userAnswers.value[q.id];
    if (!answerId) continue;
    const choice = q.choices.find((c) => c.id === answerId);
    if (choice?.isCorrect) correct++;
  }
  return { correct, total: testQuestions.value.length };
});

const startTest = async () => {
  if (!selectedTest.value) return;
  testOpen.value = true;
  testLoading.value = true;
  testQuestions.value = [];
  userAnswers.value = {};
  currentQIdx.value = 0;
  testFinished.value = false;
  try {
    const res = await CardTestsService.GetById(selectedTest.value.id);
    const ctqs = res.data?.cardTestQuestions ?? [];
    // Fetch each question detail (with choices)
    const fetched = await Promise.all(
      ctqs.map((q: any) =>
        QuestionsService.GetById(q.questionId)
          .then((r) => r.data)
          .catch(() => null),
      ),
    );
    testQuestions.value = fetched.filter((q): q is Question => !!q && !!q.choices);
    if (!testQuestions.value.length) {
      notify({ text: t("noQuestionsInTest"), type: "warn" });
    }
  } catch (e) {
    setError(e as any);
  } finally {
    testLoading.value = false;
  }
};

const pickAnswer = (questionId: number, choiceId: number) => {
  // Lock answer on first pick — show correct/incorrect immediately
  if (userAnswers.value[questionId] != null) return;
  userAnswers.value[questionId] = choiceId;
};

const getChoiceState = (
  question: Question,
  choiceId: number,
): "neutral" | "picked" | "correct" | "wrong" => {
  const answered = userAnswers.value[question.id];
  if (answered == null) {
    return "neutral";
  }
  const choice = question.choices.find((c) => c.id === choiceId);
  // Correct choice — always green once answered
  if (choice?.isCorrect) return "correct";
  // User's wrong pick — red
  if (answered === choiceId) return "wrong";
  return "neutral";
};
const nextQuestion = () => {
  if (currentQIdx.value < testQuestions.value.length - 1) {
    currentQIdx.value++;
  } else {
    testFinished.value = true;
  }
};
const prevQuestion = () => {
  if (currentQIdx.value > 0) currentQIdx.value--;
};
const closeTest = () => {
  testOpen.value = false;
};
const restartTest = () => {
  userAnswers.value = {};
  currentQIdx.value = 0;
  testFinished.value = false;
};
const questionImageUrl = (fileId: string | null | undefined) =>
  fileId ? FilesService.buildFileUrl(fileId) : "";

const submissionFileUrl = (fn: string) =>
  FilesService.buildFileUrl(fn, "assignmentSubmissions");
const courseImageUrl = computed(() =>
  course.value?.imageFileId
    ? FilesService.buildFileUrl(course.value.imageFileId, "coursesImage")
    : "",
);

const formatDate = (s: string | null) => (s ? new Date(s).toLocaleString() : "");

onMounted(async () => {
  await fetchCourse();
  await fetchLessons();
  fetchCourseAttempts();
});

watch(
  () => route.params.id,
  () => {
    activeLesson.value = null;
    selectedTestId.value = null;
    fetchCourse();
    fetchLessons();
  },
);
</script>

<template>
  <div class="lms">
    <!-- Header -->
    <div class="lms__header">
      <div class="lms__header-left">
        <button class="lms__back" @click="router.back()" aria-label="back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button class="lms__menu" @click="sidebarOpen = true" aria-label="menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div v-if="courseImageUrl" class="lms__avatar">
          <img :src="courseImageUrl" alt="" />
        </div>
        <h1 class="lms__title">{{ course?.name || t("loading") }}</h1>
      </div>

      <div class="lms__tabs">
        <template v-if="activeLesson">
          <button
            v-for="tab in (['video','theory','test','assignment'] as MainTab[])"
            :key="tab"
            type="button"
            class="lms__tab"
            :class="{ 'lms__tab--active': activeTab === tab }"
            @click="activeTab = tab"
          >
            <span class="lms__tab-icon">
              <svg v-if="tab === 'video'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              <svg v-else-if="tab === 'theory'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <svg v-else-if="tab === 'test'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z"/><rect x="5" y="4" width="14" height="18" rx="2"/></svg>
            </span>
            <span class="lms__tab-label">
              {{
                tab === "video" ? t("videoResourceTab") :
                tab === "theory" ? t("theoryTab") :
                tab === "test" ? t("testTab") :
                t("assignmentTab")
              }}
            </span>
            <span v-if="tabStatus[tab as Exclude<MainTab, 'attempts'>]" class="lms__tab-dot lms__tab-dot--done">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span v-else class="lms__tab-dot"></span>
          </button>
        </template>

        <button
          type="button"
          class="lms__tab lms__tab--attempts"
          :class="{ 'lms__tab--active': activeTab === 'attempts' }"
          @click="activeTab = 'attempts'"
        >
          <span class="lms__tab-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span class="lms__tab-label">{{ t("myAttempts") }}</span>
          <span v-if="courseAttempts.length" class="lms__tab-count">{{ courseAttempts.length }}</span>
        </button>
      </div>
    </div>

    <div v-if="courseLoading" class="lms__loading">
      <v-progress-circular indeterminate color="#10B981" :size="40" />
    </div>

    <div v-if="!courseLoading && course" class="lms__body">
      <!-- Mobile overlay -->
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="sidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
        <button class="sidebar__close" @click="sidebarOpen = false" aria-label="close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="sidebar__progress">
          <div class="sidebar__progress-head">
            <div class="sidebar__progress-title">
              {{ t("lessonsCount", { count: lessons.length }) }}
            </div>
            <div class="sidebar__progress-pct">{{ overallProgress }}%</div>
          </div>
          <div class="sidebar__progress-bar">
            <div class="sidebar__progress-fill" :style="{ width: overallProgress + '%' }" />
          </div>
        </div>

        <div
          v-for="(lesson, idx) in lessons"
          :key="lesson.id"
          class="lesson-group"
          :class="{ 'lesson-group--active': activeLesson?.id === lesson.id }"
          @click="selectLesson(lesson)"
        >
          <div class="lesson-group__head">
            <span class="lesson-group__name">
              <span class="lesson-group__idx">{{ lesson.orderCode ?? idx + 1 }}.</span>
              {{ lesson.name }}
            </span>
            <span class="lesson-group__pct">{{ Math.round(lesson.progressPercentage || 0) }}%</span>
          </div>
          <div v-if="activeLesson?.id === lesson.id" class="lesson-group__body" @click.stop>
            <button
              class="lesson-item"
              :class="{ 'lesson-item--active': activeTab === 'video', 'lesson-item--done': !!lesson.videoFileId }"
              @click="activeTab = 'video'"
            >
              <span class="lesson-item__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2"/>
                </svg>
              </span>
              <span>{{ t("videoResourceTab") }}</span>
              <span v-if="lesson.videoFileId" class="lesson-item__dot"></span>
            </button>

            <button
              class="lesson-item"
              :class="{ 'lesson-item--active': activeTab === 'theory', 'lesson-item--done': !!(lesson.resourceText || lesson.resourceFileId) }"
              @click="activeTab = 'theory'"
            >
              <span class="lesson-item__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </span>
              <span>{{ t("theoryTab") }}</span>
              <span v-if="lesson.resourceText || lesson.resourceFileId" class="lesson-item__dot"></span>
            </button>

            <button
              class="lesson-item"
              :class="{ 'lesson-item--active': activeTab === 'test', 'lesson-item--done': (lesson.testsCount ?? 0) > 0 }"
              @click="activeTab = 'test'"
            >
              <span class="lesson-item__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </span>
              <span>{{ t("testTab") }}</span>
              <span v-if="lesson.testsCount" class="lesson-item__count">{{ lesson.testsCount }}</span>
            </button>

            <button
              class="lesson-item"
              :class="{ 'lesson-item--active': activeTab === 'assignment', 'lesson-item--done': !!(lesson.assignmentText || lesson.assignmentFileId) }"
              @click="activeTab = 'assignment'"
            >
              <span class="lesson-item__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z"/>
                  <rect x="5" y="4" width="14" height="18" rx="2"/>
                </svg>
              </span>
              <span>{{ t("assignmentTab") }}</span>
              <span v-if="lesson.hasPendingSubmission" class="lesson-item__badge lesson-item__badge--pending">!</span>
              <span v-else-if="lesson.latestGrade != null" class="lesson-item__badge lesson-item__badge--grade">{{ lesson.latestGrade }}</span>
            </button>
          </div>
        </div>

        <div v-if="!lessons.length" class="empty-state">{{ t("noLessons") }}</div>
      </aside>

      <!-- Main -->
      <section class="main">
        <!-- ATTEMPTS TAB (course-level) -->
        <div v-if="activeTab === 'attempts'" class="main-card">
          <h2 class="main-card__title">{{ t("myAttempts") }}</h2>

          <div v-if="attemptsLoading" class="empty-block"><v-progress-circular indeterminate color="#16A34A" :size="28" /></div>
          <div v-else-if="!courseAttempts.length" class="empty-block">{{ t("noAttempts") }}</div>

          <div v-else class="attempts-list">
            <div
              v-for="(a, idx) in courseAttempts"
              :key="a.id"
              class="attempt-card"
              :class="{ 'attempt-card--active': a.isActive }"
            >
              <div class="attempt-card__head">
                <span class="attempt-card__num">#{{ courseAttempts.length - idx }}</span>
                <span class="attempt-card__date">{{ formatDate(a.startedDate) }}</span>
                <span v-if="a.isActive" class="attempt-card__status attempt-card__status--active">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                  {{ t("inProgress") }}
                </span>
                <span v-else class="attempt-card__status attempt-card__status--done">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ t("finished") }}
                </span>
              </div>
              <div class="attempt-card__body">
                <div class="attempt-card__info">
                  <div class="attempt-card__lesson">{{ a.lessonName || '—' }}</div>
                  <div class="attempt-card__test">{{ a.cardTestShortName || '' }}</div>
                </div>
                <div class="attempt-card__score" :class="scoreClass(a.scorePercent)">
                  <div class="attempt-card__score-pct">{{ Math.round(a.scorePercent || 0) }}%</div>
                  <div class="attempt-card__score-raw">{{ a.correctAnswerCount }}/{{ a.questionsCount }}</div>
                </div>
              </div>
              <div class="attempt-card__actions">
                <button v-if="a.isActive && a.cardTestId" class="btn-primary btn-sm" @click="resumeAttempt(a)">
                  {{ t("continueTest") }}
                </button>
                <button v-else class="btn-outline btn-sm" @click="openAttemptResult(a.id)">
                  {{ t("lookResult") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!activeLesson" class="main-card">
          <div class="empty-block">{{ t("selectLesson") }}</div>
        </div>

        <template v-else>
          <!-- VIDEO -->
          <div v-if="activeTab === 'video'" class="main-card">
            <h2 class="main-card__title">
              {{ activeLesson.name }}
            </h2>
            <div v-if="activeLesson.videoFileId" class="video-wrap">
              <video :src="videoUrl" controls preload="metadata" controlsList="nodownload"></video>
            </div>
            <div v-else class="empty-block">{{ t("noVideo") }}</div>
            <div v-if="activeLesson.description" class="main-card__desc">
              <p>{{ activeLesson.description }}</p>
            </div>
          </div>

          <!-- THEORY -->
          <div v-if="activeTab === 'theory'" class="main-card">
            <h2 class="main-card__title">{{ t("theoryTab") }}</h2>
            <div v-if="activeLesson.resourceText" class="main-card__text">
              {{ activeLesson.resourceText }}
            </div>
            <a v-if="activeLesson.resourceFileId" :href="resourceUrl" target="_blank" rel="noopener" class="download-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ t("downloadResource") }}
            </a>
            <div v-if="!activeLesson.resourceText && !activeLesson.resourceFileId" class="empty-block">
              {{ t("noResource") }}
            </div>
          </div>

          <!-- TEST -->
          <div v-if="activeTab === 'test'" class="main-card">
            <h2 class="main-card__title">{{ t("testTab") }}</h2>

            <div v-if="selectedTest" class="test-detail">
              <div class="test-detail__head">
                <div class="test-detail__title">{{ selectedTest.shortName }}</div>
                <div v-if="selectedTest.fullName" class="test-detail__sub">{{ selectedTest.fullName }}</div>
              </div>
              <div class="test-detail__stats">
                <div class="stat">
                  <span class="stat__label">{{ t("totalQuestions") }}</span>
                  <span class="stat__value">{{ selectedTest.cardTestQuestions?.length ?? 0 }}</span>
                </div>
              </div>
              <button class="btn-primary" @click="startTest">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {{ t("startTest") }}
              </button>
            </div>

            <div v-else class="empty-block">{{ t("noTestsInCourse") }}</div>

            <!-- My attempts for this lesson -->
            <div v-if="lessonAttempts.length" class="lesson-attempts">
              <h3 class="main-card__sub">{{ t("myAttempts") }}</h3>
              <div class="lesson-attempts__grid">
                <div
                  v-for="(a, idx) in lessonAttempts.slice(0, 5)"
                  :key="a.id"
                  class="mini-attempt"
                  :class="scoreClass(a.scorePercent)"
                >
                  <div class="mini-attempt__head">
                    <span class="mini-attempt__num">#{{ lessonAttempts.length - idx }}</span>
                    <span class="mini-attempt__date">{{ formatDate(a.startedDate) }}</span>
                  </div>
                  <div class="mini-attempt__score">{{ a.correctAnswerCount }}/{{ a.questionsCount }}</div>
                  <div class="mini-attempt__pct">{{ Math.round(a.scorePercent || 0) }}%</div>
                  <button class="mini-attempt__btn" @click="a.isActive ? resumeAttempt(a) : openAttemptResult(a.id)">
                    {{ a.isActive ? t("continueTest") : t("lookResult") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ASSIGNMENT -->
          <div v-if="activeTab === 'assignment'" class="main-card">
            <div class="assign-head">
              <h2 class="main-card__title">{{ t("assignmentTab") }}</h2>
              <button
                v-if="(activeLesson.assignmentText || activeLesson.assignmentFileId) && activeLesson.latestGrade == null"
                class="btn-primary"
                @click="openSubmit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ t("submitAssignment") }}
              </button>
              <div v-else-if="activeLesson.latestGrade != null" class="already-graded-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ t("alreadyGraded") }} — {{ t("gradeLabel", { grade: activeLesson.latestGrade }) }}
              </div>
            </div>
            <div v-if="activeLesson.assignmentText" class="main-card__text">{{ activeLesson.assignmentText }}</div>
            <a v-if="activeLesson.assignmentFileId" :href="assignmentUrl" target="_blank" rel="noopener" class="download-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ t("downloadAssignment") }}
            </a>
            <div v-if="!activeLesson.assignmentText && !activeLesson.assignmentFileId" class="empty-block">{{ t("noAssignment") }}</div>

            <div v-if="submissions.length" class="submissions">
              <h3 class="main-card__sub">{{ t("mySubmissions") }}</h3>
              <div v-for="s in submissions" :key="s.id" class="submission-card">
                <div class="submission-card__head">
                  <span class="submission-card__attempt">{{ t("attemptNumber", { n: s.attemptNumber }) }}</span>
                  <span v-if="s.grade != null" class="submission-card__grade">{{ t("gradeLabel", { grade: s.grade }) }}</span>
                  <span v-else class="submission-card__pending">{{ t("gradePending") }}</span>
                </div>
                <div v-if="s.answerText" class="submission-card__text">{{ s.answerText }}</div>
                <a v-if="s.fileId" :href="submissionFileUrl(s.fileId)" target="_blank" rel="noopener" class="submission-card__file">📎 {{ s.fileId }}</a>
                <div v-if="s.teacherFeedback" class="submission-card__feedback">💬 {{ s.teacherFeedback }}</div>
                <div class="submission-card__meta">{{ t("submittedAt") }}: {{ formatDate(s.submittedAt) }}</div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>

    <!-- Submit assignment dialog -->
    <v-dialog v-model="submitOpen" width="560" max-width="95vw">
      <div class="submit-dialog">
        <div class="submit-dialog__head">
          <div class="submit-dialog__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="submit-dialog__head-title">
            <h3>{{ t("submitAssignment") }}</h3>
            <div class="submit-dialog__sub">{{ activeLesson?.name }}</div>
          </div>
          <button class="submit-dialog__close" @click="submitOpen = false">×</button>
        </div>

        <div class="submit-dialog__body">
          <label class="field-label">{{ t("yourAnswer") }}</label>
          <v-textarea v-model="submitData.answerText" variant="outlined" density="comfortable" rows="4" auto-grow hide-details :placeholder="t('yourAnswer')" />

          <label class="field-label mt-3">{{ t("comment") }}</label>
          <v-text-field v-model="submitData.comment" variant="outlined" density="comfortable" hide-details :placeholder="t('comment')" />

          <label class="field-label mt-3">{{ t("attachFile") }}</label>
          <label class="file-drop" :class="{ 'file-drop--has': submitData.fileName }">
            <input type="file" @change="onPickSubmitFile" />
            <template v-if="submitData.fileName">
              <div class="file-drop__icon-on">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                </svg>
              </div>
              <span>{{ submitData.fileName }}</span>
              <button type="button" class="file-drop__x" @click.stop.prevent="submitData.file = null; submitData.fileName = ''">×</button>
            </template>
            <template v-else>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>{{ t("attachFile") }}</span>
            </template>
          </label>
        </div>

        <div class="submit-dialog__footer">
          <button class="footer-btn footer-btn--cancel" @click="submitOpen = false" :disabled="submitLoading">{{ t("cancel") }}</button>
          <button class="footer-btn footer-btn--save" @click="sendSubmission" :disabled="submitLoading">
            <v-progress-circular v-if="submitLoading" indeterminate size="16" width="2" color="white" />
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span>{{ submitUploading ? t("uploadingFiles") : t("submitAssignment") }}</span>
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- Test taker dialog (fullscreen) -->
    <v-dialog v-model="testOpen" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <div class="test-taker">
        <!-- Header -->
        <div class="tt-header">
          <button class="tt-close" @click="closeTest" aria-label="close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div class="tt-title">{{ selectedTest?.shortName || t("testTab") }}</div>
          <div class="tt-counter" v-if="!testLoading && testQuestions.length && !testFinished">
            <strong>{{ currentQIdx + 1 }}</strong> / {{ testQuestions.length }}
          </div>
        </div>

        <!-- Progress bar -->
        <div class="tt-progress" v-if="!testLoading && testQuestions.length && !testFinished">
          <div class="tt-progress__fill" :style="{ width: ((currentQIdx + 1) / testQuestions.length * 100) + '%' }"></div>
        </div>

        <!-- Body -->
        <div class="tt-body">
          <div v-if="testLoading" class="tt-loading">
            <v-progress-circular indeterminate color="#16A34A" :size="40" />
          </div>

          <!-- Taking questions -->
          <div v-else-if="!testFinished && currentQuestion" class="tt-content">
            <div class="tq-layout" :class="{ 'tq-layout--with-image': !!currentQuestion.fileId }">
              <div class="tq-card">
                <div class="tq-card__qnum">{{ currentQIdx + 1 }} — {{ t("testPage") }}</div>
                <h2 class="tq-card__text">{{ currentQuestion.questionText }}</h2>

                <div class="tq-choices">
                  <button
                    v-for="(c, idx) in currentQuestion.choices"
                    :key="c.id"
                    type="button"
                    class="tq-choice"
                    :class="{
                      'tq-choice--correct': getChoiceState(currentQuestion, c.id) === 'correct',
                      'tq-choice--wrong': getChoiceState(currentQuestion, c.id) === 'wrong',
                      'tq-choice--locked': userAnswers[currentQuestion.id] != null,
                    }"
                    :disabled="userAnswers[currentQuestion.id] != null"
                    @click="pickAnswer(currentQuestion.id, c.id)"
                  >
                    <span class="tq-choice__letter">{{ ['A', 'B', 'C', 'D', 'E', 'F'][idx] }}</span>
                    <span class="tq-choice__text">{{ c.choiceText }}</span>
                    <span class="tq-choice__radio">
                      <svg v-if="getChoiceState(currentQuestion, c.id) === 'correct'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <svg v-else-if="getChoiceState(currentQuestion, c.id) === 'wrong'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  </button>
                </div>
              </div>

              <!-- Right side image -->
              <div v-if="currentQuestion.fileId" class="tq-image">
                <img :src="questionImageUrl(currentQuestion.fileId)" alt="question" />
              </div>
            </div>
          </div>

          <!-- Result -->
          <div v-else-if="testFinished" class="tt-content">
            <div class="test-result">
              <div class="test-result__hero" :class="{ 'test-result__hero--ok': testScore.correct === testScore.total }">
                <div class="test-result__pct">
                  {{ testScore.total ? Math.round((testScore.correct / testScore.total) * 100) : 0 }}%
                </div>
                <div class="test-result__label">{{ t("testResult") }}</div>
              </div>
              <div class="test-result__stats">
                <div class="result-stat">
                  <span class="result-stat__label">{{ t("correctAnswers") }}</span>
                  <span class="result-stat__value result-stat__value--ok">{{ testScore.correct }}</span>
                </div>
                <div class="result-stat">
                  <span class="result-stat__label">{{ t("incorrectAnswers") }}</span>
                  <span class="result-stat__value result-stat__value--err">{{ testScore.total - testScore.correct }}</span>
                </div>
                <div class="result-stat">
                  <span class="result-stat__label">{{ t("totalQuestions") }}</span>
                  <span class="result-stat__value">{{ testScore.total }}</span>
                </div>
              </div>
              <div class="test-result__actions">
                <button class="footer-btn footer-btn--cancel" @click="restartTest">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  {{ t("startTest") }}
                </button>
                <button class="footer-btn footer-btn--save" @click="closeTest">{{ t("backToHome") }}</button>
              </div>
            </div>
          </div>

          <div v-else class="tt-empty">{{ t("noQuestionsInTest") }}</div>
        </div>

        <!-- Footer -->
        <div v-if="!testLoading && testQuestions.length && !testFinished" class="tt-footer">
          <button class="tt-foot-btn tt-foot-btn--back" @click="prevQuestion" :disabled="currentQIdx === 0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>{{ t("back") }}</span>
          </button>

          <div class="tt-nav">
            <button
              v-for="(q, i) in testQuestions"
              :key="q.id"
              type="button"
              class="tt-nav__dot"
              :class="{
                'tt-nav__dot--active': i === currentQIdx,
                'tt-nav__dot--answered': userAnswers[q.id],
              }"
              @click="currentQIdx = i"
            >{{ i + 1 }}</button>
          </div>

          <button
            class="tt-foot-btn tt-foot-btn--next"
            @click="nextQuestion"
            :disabled="!userAnswers[currentQuestion?.id]"
          >
            <span>{{ currentQIdx < testQuestions.length - 1 ? t("nextQuestion") : t("finishQuestion") }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
$accent: #16A34A;
$accent-soft: #ECFDF5;

.lms { min-height: 100vh; background: #F3F4F6; padding: 20px; animation: fadeIn 0.25s ease;
  :deep(.lms-inner) { max-width: 1280px; margin: 0 auto; }
  @media (max-width: 768px) { padding: 10px; } }
.lms > * { max-width: 1280px; margin-left: auto; margin-right: auto; }
.lms__header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 0 4px 14px;
  @media (max-width: 768px) { gap: 10px; padding: 0 2px 10px; } }
.lms__header-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
.lms__back { width: 32px; height: 32px; border-radius: 50%; background: white; border: 1px solid #E5E7EB; color: #6B7280; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
  &:hover { background: #F3F4F6; color: #1F2937; } }
.lms__menu { display: none; width: 32px; height: 32px; border-radius: 50%; background: white; border: 1px solid #E5E7EB; color: #6B7280; cursor: pointer; align-items: center; justify-content: center; flex-shrink: 0;
  &:hover { background: #F3F4F6; color: #1F2937; }
  @media (max-width: 960px) { display: inline-flex; } }
.lms__avatar { width: 40px; height: 40px; border-radius: 10px; overflow: hidden; background: #1F2937; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
  @media (max-width: 480px) { width: 32px; height: 32px; border-radius: 8px; } }
.lms__title { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #1F2937; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
  @media (max-width: 768px) { font-size: 15px; }
  @media (max-width: 480px) { font-size: 14px; } }
.lms__tabs { display: flex; gap: 6px; padding: 4px; background: white; border-radius: 999px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); overflow-x: auto; max-width: 100%;
  &::-webkit-scrollbar { display: none; }
  @media (max-width: 768px) { gap: 3px; padding: 3px; width: 100%; justify-content: flex-start; } }
.lms__tab { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: none; background: transparent; border-radius: 999px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  &-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 6px; background: $accent; color: white; border-radius: 999px; font-size: 10px; font-weight: 700; }
  &--attempts &-count { background: #5D87FF; }
  &--attempts.lms__tab--active &-count { background: white; color: #1F2937; }
  @media (max-width: 480px) { padding: 7px 10px; font-size: 11px;
    .lms__tab-label { display: none; } }
  &--active { background: #1F2937; color: white; }
  &-dot { width: 14px; height: 14px; border-radius: 50%; background: #D1D5DB; display: inline-flex; align-items: center; justify-content: center; color: white;
    &--done { background: $accent; } } }
.lms__loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; }
.lms__body { display: grid; grid-template-columns: 320px 1fr; gap: 16px; position: relative;
  @media (max-width: 960px) { grid-template-columns: 1fr; } }
.sidebar-overlay { display: none;
  @media (max-width: 960px) { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 10; animation: fadeIn 0.2s; } }
.sidebar { background: white; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; gap: 10px;
  position: sticky; top: 12px; max-height: calc(100vh - 24px); overflow-y: auto; align-self: flex-start;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px;
    &:hover { background: #9CA3AF; } }
  @media (max-width: 960px) { position: fixed; top: 0; left: 0; bottom: 0; width: 320px; max-width: 85vw; max-height: 100vh; z-index: 20; border-radius: 0 14px 14px 0; transform: translateX(-100%); transition: transform 0.25s ease; padding-top: 50px;
    &--open { transform: translateX(0); } } }
.sidebar__close { display: none;
  @media (max-width: 960px) { display: inline-flex; position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; align-items: center; justify-content: center; background: #F3F4F6; color: #6B7280; border: none; border-radius: 50%; cursor: pointer; z-index: 1;
    &:hover { background: #FEE2E2; color: #EF4444; } } }
.sidebar__progress { padding: 8px 4px 14px; border-bottom: 1px solid #F0F2F5; flex-shrink: 0;
  &-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  &-title { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; }
  &-pct { font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; color: $accent; }
  &-bar { height: 6px; background: #F3F4F6; border-radius: 999px; overflow: hidden; }
  &-fill { height: 100%; background: $accent; border-radius: 999px; transition: width 0.3s; } }
.lesson-group { border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden; transition: all 0.2s; cursor: pointer; flex-shrink: 0;
  &--active { background: $accent-soft; border-color: $accent; }
  &__head { width: 100%; display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: transparent; border: none; font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937; text-align: left; min-height: 44px; }
  &__name { flex: 1; min-width: 0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__idx { color: #6B7280; font-weight: 700; margin-right: 4px; }
  &__pct { font-size: 11px; font-weight: 700; color: white; background: #3B82F6; padding: 3px 8px; border-radius: 999px; }
  &--active &__pct { background: $accent; }
  &__body { padding: 4px 10px 12px; display: flex; flex-direction: column; gap: 6px; } }
.lesson-item { width: 100%; display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: white; border: 1px solid transparent; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s; text-align: left;
  &:hover { background: $accent-soft; color: $accent; }
  &--active { background: $accent; color: white;
    .lesson-item__icon { background: rgba(255,255,255,0.25); color: white; } }
  &--done:not(.lesson-item--active) { color: #1F2937;
    .lesson-item__icon { background: $accent-soft; color: $accent; } }
  &__icon { width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; background: #F3F4F6; border-radius: 6px; color: #9CA3AF; flex-shrink: 0; }
  &__dot { margin-left: auto; width: 6px; height: 6px; border-radius: 50%; background: $accent; }
  &__count { margin-left: auto; padding: 1px 7px; background: rgba(255,255,255,0.3); color: inherit; border-radius: 999px; font-size: 10px; font-weight: 700; }
  &--done:not(.lesson-item--active) &__count { background: $accent-soft; color: $accent; }
  &:not(.lesson-item--active):not(.lesson-item--done) &__count { background: #F3F4F6; color: #6B7280; }
  &__badge { margin-left: auto; min-width: 22px; padding: 1px 6px; border-radius: 999px; font-size: 10px; font-weight: 700; text-align: center;
    &--pending { background: #FEF3C7; color: #D97706; }
    &--grade { background: $accent-soft; color: $accent; } } }
.lesson-test-card { background: white; border-radius: 10px; padding: 10px 12px; border: 1px dashed #BBF7D0; margin-top: 4px;
  &__title { font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; color: #1F2937; }
  &__hint { font-family: 'Poppins', sans-serif; font-size: 11px; color: #6B7280; margin-top: 2px; }
  &__btn { margin-top: 8px; width: 100%; padding: 8px 12px; border: none; border-radius: 999px; background: $accent; color: white; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer;
    &:hover { background: #15803D; } } }
.empty-state { padding: 22px; text-align: center; font-family: 'Poppins', sans-serif; font-size: 14px; color: #9CA3AF; background: #F9FAFB; border-radius: 10px; }
.main { display: flex; flex-direction: column; gap: 12px; }
.main-card { background: white; border-radius: 14px; padding: 22px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  @media (max-width: 768px) { padding: 16px; border-radius: 10px; } }
.main-card__title { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #1F2937; margin: 0 0 16px;
  @media (max-width: 480px) { font-size: 16px; margin-bottom: 12px; } }
.main-card__sub { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; color: #1F2937; margin: 16px 0 6px; }
.main-card__desc { margin-top: 16px; padding: 14px 16px; background: #F9FAFB; border-radius: 10px; border-left: 3px solid $accent; }
.main-card__desc p, .main-card__text { font-family: 'Poppins', sans-serif; font-size: 14px; color: #4B5563; line-height: 1.65; white-space: pre-line; margin: 0; }
.video-wrap { width: 100%; background: #000; border-radius: 10px; overflow: hidden;
  video { width: 100%; display: block; max-height: 70vh; } }
.empty-block { padding: 28px 16px; background: #F9FAFB; border-radius: 10px; font-family: 'Poppins', sans-serif; font-size: 13px; color: #9CA3AF; text-align: center; }

/* ===== Attempts ===== */
.attempts-list { display: flex; flex-direction: column; gap: 10px; }
.attempt-card { background: #FAFBFC; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; transition: all 0.2s;
  &--active { border-color: #F59E0B; background: #FFFBEB; }
  &__head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
  &__num { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; color: #6B7280; background: white; padding: 3px 10px; border-radius: 999px; }
  &__date { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; }
  &__status { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; border-radius: 999px; margin-left: auto;
    &--active { color: #D97706; background: #FEF3C7; }
    &--done { color: $accent; background: $accent-soft; } }
  &__body { display: flex; align-items: center; gap: 12px; justify-content: space-between; margin-bottom: 12px; }
  &__info { flex: 1; min-width: 0; }
  &__lesson { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; color: #1F2937; }
  &__test { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; margin-top: 2px; }
  &__score { text-align: right; padding: 8px 14px; border-radius: 10px; background: #F9FAFB; min-width: 86px;
    &.score--good { background: $accent-soft; color: $accent; }
    &.score--mid { background: #FEF3C7; color: #D97706; }
    &.score--bad { background: #FEE2E2; color: #EF4444; } }
  &__score-pct { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 800; line-height: 1.2; }
  &__score-raw { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; opacity: 0.85; }
  &__actions { display: flex; gap: 8px; } }
.btn-sm { padding: 7px 14px !important; font-size: 12px !important; }
.btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: white; color: $accent; border: 1px solid $accent; border-radius: 10px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:hover { background: $accent-soft; } }

/* Lesson-level mini attempts widget */
.lesson-attempts { margin-top: 20px; }
.lesson-attempts__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.mini-attempt { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; font-family: 'Poppins', sans-serif;
  &.score--good { border-color: #BBF7D0; background: $accent-soft; }
  &.score--mid { border-color: #FDE68A; background: #FFFBEB; }
  &.score--bad { border-color: #FCA5A5; background: #FEF2F2; }
  &__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  &__num { font-size: 11px; font-weight: 700; color: #6B7280; }
  &__date { font-size: 10px; color: #9CA3AF; }
  &__score { font-size: 14px; font-weight: 700; color: #1F2937; }
  &__pct { font-size: 22px; font-weight: 800; margin: 2px 0 8px;
    .score--good & { color: $accent; }
    .score--mid & { color: #D97706; }
    .score--bad & { color: #EF4444; } }
  &__btn { width: 100%; padding: 7px 10px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; font-family: inherit; font-size: 11px; font-weight: 600; color: #1F2937; cursor: pointer; transition: all 0.2s;
    &:hover { background: $accent; color: white; border-color: $accent; } } }
.download-pill { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; padding: 8px 16px; background: $accent-soft; color: $accent; border-radius: 999px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.2s;
  &:hover { background: #DCFCE7; } }
.test-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; overflow-x: auto; -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { display: none; } }
.test-pill { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 999px; padding: 6px 14px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  &:hover { border-color: $accent; color: $accent; }
  &--active { background: $accent; border-color: $accent; color: white; } }
.test-detail__head { margin-bottom: 16px; }
.test-detail__title { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: #1F2937; margin-bottom: 4px; }
.test-detail__sub { font-family: 'Poppins', sans-serif; font-size: 13px; color: #6B7280; }
.test-detail__stats { display: flex; gap: 10px; margin-bottom: 18px; }
.stat { background: #F9FAFB; border-radius: 10px; padding: 10px 16px; display: flex; flex-direction: column;
  &__label { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; color: #6B7280; text-transform: uppercase; }
  &__value { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: #1F2937; } }
.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: $accent; color: white; border: none; border-radius: 10px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;
  &:hover { background: #15803D; } }
.assign-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.already-graded-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: $accent-soft; color: $accent; border-radius: 10px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700; }
.submissions { margin-top: 20px;
  .submission-card { background: #F9FAFB; border: 1px solid #F0F2F5; border-radius: 10px; padding: 12px 14px; margin-top: 8px;
    &__head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    &__attempt { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; color: #6B7280; background: white; padding: 2px 10px; border-radius: 999px; }
    &__grade { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; color: $accent; background: $accent-soft; padding: 2px 10px; border-radius: 999px; }
    &__pending { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #D97706; background: #FEF3C7; padding: 2px 10px; border-radius: 999px; }
    &__text { font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937; margin-bottom: 6px; }
    &__file { display: inline-block; font-family: 'Poppins', sans-serif; font-size: 12px; color: #5D87FF; text-decoration: none; margin-bottom: 6px; &:hover { text-decoration: underline; } }
    &__feedback { padding: 8px 12px; background: white; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 12px; color: #1F2937; margin-bottom: 6px; }
    &__meta { font-family: 'Poppins', sans-serif; font-size: 11px; color: #9CA3AF; } } }
.submit-dialog { background: white; border-radius: 16px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
  &__head { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid #F0F2F5; }
  &__icon { width: 44px; height: 44px; border-radius: 12px; background: $accent-soft; color: $accent; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  &__head-title { flex: 1; min-width: 0;
    h3 { font-family: 'Poppins', sans-serif; font-size: 17px; font-weight: 700; color: #1F2937; margin: 0; line-height: 1.2; } }
  &__sub { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__close { width: 32px; height: 32px; background: #F3F4F6; border: none; border-radius: 50%; cursor: pointer; color: #6B7280; font-size: 18px; line-height: 1; flex-shrink: 0;
    &:hover { background: #FEE2E2; color: #EF4444; } }
  &__body { padding: 18px 20px; overflow-y: auto; flex: 1; }
  &__footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #F0F2F5; background: #FAFBFC; } }
.field-label { display: block; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #1F2937; margin-bottom: 6px; }
.file-drop { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border: 1.5px dashed #DBE4FF; border-radius: 10px; background: #F8FAFF; font-family: 'Poppins', sans-serif; font-size: 13px; color: #5D87FF; cursor: pointer; font-weight: 600; transition: all 0.2s;
  input { display: none; }
  &:hover { background: #EEF2FF; border-color: #5D87FF; }
  &--has { border-style: solid; border-color: #BBF7D0; background: #F0FDF4; color: $accent; }
  &__icon-on { width: 32px; height: 32px; border-radius: 8px; background: white; display: flex; align-items: center; justify-content: center; }
  &__x { margin-left: auto; width: 24px; height: 24px; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;
    &:hover { background: #FCA5A5; color: white; } } }

/* ===== Test taker ===== */
.test-taker { min-height: 100vh; background: #F9FAFB; display: flex; flex-direction: column; font-family: 'Poppins', sans-serif; }

.tt-header { display: flex; align-items: center; gap: 14px; padding: 14px 24px; background: white; border-bottom: 1px solid #F0F2F5;
  @media (max-width: 768px) { padding: 12px 14px; gap: 10px; } }
.tt-close { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; background: #F3F4F6; color: #6B7280; border: none; border-radius: 50%; cursor: pointer; flex-shrink: 0;
  &:hover { background: #FEE2E2; color: #EF4444; } }
.tt-title { flex: 1; min-width: 0; font-size: 16px; font-weight: 700; color: #1F2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tt-counter { font-size: 13px; font-weight: 600; color: $accent; background: $accent-soft; padding: 6px 14px; border-radius: 999px;
  strong { font-weight: 800; } }

.tt-progress { height: 4px; background: #E5E7EB;
  &__fill { height: 100%; background: $accent; transition: width 0.3s; } }

.tt-body { flex: 1; display: flex; flex-direction: column; overflow-y: auto; padding: 24px 20px;
  @media (max-width: 768px) { padding: 16px 12px; } }
.tt-content { flex: 1; display: flex; justify-content: center; align-items: flex-start; }
.tt-loading { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 300px; }
.tt-empty { flex: 1; padding: 40px 20px; text-align: center; color: #9CA3AF; font-size: 14px; }

.tq-layout { width: 100%; max-width: 760px; display: flex; flex-direction: column; gap: 16px;
  &--with-image { max-width: 1200px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 480px); align-items: start;
    @media (max-width: 960px) { grid-template-columns: 1fr; max-width: 760px; } } }
.tq-image { position: sticky; top: 0; background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); padding: 16px; display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: auto; max-height: 60vh; object-fit: contain; border-radius: 10px; background: #F3F4F6; display: block; }
  @media (max-width: 960px) { position: static; padding: 12px; } }
.tq-card { width: 100%; background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); padding: 32px 28px; min-width: 0;
  @media (max-width: 768px) { padding: 20px 18px; border-radius: 12px; } }
.tq-card__qnum { display: inline-block; font-size: 12px; font-weight: 700; color: $accent; background: $accent-soft; padding: 5px 14px; border-radius: 999px; margin-bottom: 16px; letter-spacing: 0.3px; }
.tq-card__text { font-size: 20px; font-weight: 700; color: #1F2937; line-height: 1.5; margin: 0 0 20px;
  @media (max-width: 768px) { font-size: 17px; margin-bottom: 16px; }
  @media (max-width: 480px) { font-size: 15px; } }

.tq-choices { display: flex; flex-direction: column; gap: 10px; }
.tq-choice { display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: white; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer; transition: all 0.25s ease; text-align: left; font-size: 15px; color: #1F2937; font-family: inherit;
  @media (max-width: 480px) { padding: 12px 14px; gap: 10px; font-size: 14px; }
  &:hover:not(:disabled) { border-color: $accent; background: $accent-soft; }
  &:disabled { cursor: default; }
  &--locked:not(.tq-choice--correct):not(.tq-choice--wrong) { opacity: 0.6; }
  &--correct { border-color: #10B981; background: #D1FAE5;
    .tq-choice__letter { background: #10B981; color: white; }
    .tq-choice__text { color: #065F46; font-weight: 600; }
    .tq-choice__radio { border-color: #10B981; background: #10B981; color: white; } }
  &--wrong { border-color: #EF4444; background: #FEE2E2;
    .tq-choice__letter { background: #EF4444; color: white; }
    .tq-choice__text { color: #991B1B; font-weight: 600; text-decoration: line-through; }
    .tq-choice__radio { border-color: #EF4444; background: #EF4444; color: white; } }
  &__letter { width: 30px; height: 30px; border-radius: 8px; background: #F3F4F6; color: #6B7280; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; transition: all 0.25s ease; }
  &__text { flex: 1; font-weight: 500; line-height: 1.4; transition: all 0.25s ease; }
  &__radio { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #D1D5DB; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.25s ease; } }

/* Footer */
.tt-footer { display: flex; align-items: center; gap: 16px; padding: 14px 24px; background: white; border-top: 1px solid #F0F2F5;
  @media (max-width: 768px) { flex-wrap: wrap; gap: 8px; padding: 10px 12px; } }
.tt-foot-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 20px; border: none; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  @media (max-width: 768px) { padding: 9px 14px; font-size: 13px; flex: 1; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  &--back { background: #F3F4F6; color: #6B7280;
    &:hover:not(:disabled) { background: #E5E7EB; color: #1F2937; } }
  &--next { background: $accent; color: white;
    &:hover:not(:disabled) { background: #15803D; } } }

.tt-nav { flex: 1; display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; overflow-x: auto;
  @media (max-width: 768px) { order: 3; width: 100%; justify-content: flex-start; } }
.tt-nav__dot { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; background: white; border: 1.5px solid #E5E7EB; border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: 700; color: #6B7280; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  &:hover { border-color: $accent; color: $accent; }
  &--answered { background: $accent-soft; border-color: #BBF7D0; color: $accent; }
  &--active { background: $accent; border-color: $accent; color: white;
    &:hover { color: white; } } }

/* ===== Result ===== */
.test-result { width: 100%; max-width: 520px; background: white; border-radius: 18px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); padding: 32px 28px; text-align: center; }
.test-result__hero { padding: 30px 20px; border-radius: 14px; background: #FEF3C7; color: #D97706; margin-bottom: 22px;
  &--ok { background: $accent-soft; color: $accent; } }
.test-result__pct { font-family: inherit; font-size: 64px; font-weight: 800; line-height: 1; }
.test-result__label { font-family: inherit; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
.test-result__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 22px; }
.result-stat { padding: 14px 12px; background: #F9FAFB; border-radius: 12px; display: flex; flex-direction: column; gap: 4px;
  &__label { font-family: inherit; font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; }
  &__value { font-family: inherit; font-size: 24px; font-weight: 800; color: #1F2937;
    &--ok { color: $accent; }
    &--err { color: #EF4444; } } }
.test-result__actions { display: flex; gap: 10px; justify-content: center;
  .footer-btn { flex: 1; } }
.footer-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &:disabled { opacity: 0.7; cursor: not-allowed; }
  &--cancel { background: #F3F4F6; color: #1F2937;
    &:hover:not(:disabled) { background: #E5E7EB; } }
  &--save { background: $accent; color: white; min-width: 120px; justify-content: center;
    &:hover:not(:disabled) { background: #15803D; } } }
.mt-3 { margin-top: 12px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
