<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { setError } from "@/utils/helpers";
import { CoursesService } from "@/services/services/Courses.service";
import { FilesService } from "@/services/services/Files.service";
import { LessonsService } from "@/services/services/Lessons.service";
import { CardTestsService } from "@/services/services/CardTests.service";
import { QuestionsService } from "@/services/services/Questions";
import { MyAttemptsService, type AttemptItem } from "@/services/services/MyAttempts.service";
import type { AxiosError } from "axios";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const id = computed(() => route.params.id as string);
const isEdit = computed(() => +String(id.value) > 0);

// --- Course-level model ---
const formModel = ref({
  name: "",
  description: "",
  imageFileId: null as string | null,
});

// --- Inline Lesson draft (used for both create and edit-new flow) ---
type PickedFile = {
  file: File | null;
  preview: string;
  existing: string | null;
  removed: boolean;
};
const newFile = (): PickedFile => ({ file: null, preview: "", existing: null, removed: false });

interface InlineChoice { choiceText: string; isCorrect: boolean; }
interface InlineQuestion {
  questionId: number;
  questionText: string;
  newQuestion?: { questionText: string; description?: string; fileId?: string; choices: InlineChoice[] };
}

type LessonTab = "video" | "theory" | "test" | "resource" | "assignment";

interface InlineLesson {
  key: number;                  // local ref
  name: string;
  description: string;
  activeTab: LessonTab;
  expanded: boolean;
  videoFile: PickedFile;
  resourceText: string;
  resourceFile: PickedFile;
  assignmentText: string;
  assignmentFile: PickedFile;
  // inline test
  test: {
    shortName: string;
    fullName: string;
    questions: InlineQuestion[];
    mode: "pick" | "create";
    selectedQuestionId: number | null;
    questionSearch: string;
    draft: { questionText: string; description: string; image: PickedFile; choices: InlineChoice[] };
  };
}

let lessonKeyCounter = 0;
const makeLesson = (): InlineLesson => {
  lessonKeyCounter += 1;
  return {
    key: lessonKeyCounter,
    name: "",
    description: "",
    activeTab: "video",
    expanded: true,
    videoFile: newFile(),
    resourceText: "",
    resourceFile: newFile(),
    assignmentText: "",
    assignmentFile: newFile(),
    test: {
      shortName: "",
      fullName: "",
      questions: [],
      mode: "pick",
      selectedQuestionId: null,
      questionSearch: "",
      draft: {
        questionText: "",
        description: "",
        image: newFile(),
        choices: [
          { choiceText: "", isCorrect: true },
          { choiceText: "", isCorrect: false },
        ],
      },
    },
  };
};

const lessons = ref<InlineLesson[]>([]);
const existingLessons = ref<any[]>([]);
const courseImageFile = ref<PickedFile>(newFile());

const loading = ref(false);
const saveLoading = ref(false);
const progressLabel = ref<string>("");

// Admin attempts panel
const attempts = ref<AttemptItem[]>([]);
const attemptsLoading = ref(false);
const attemptsOpen = ref(false);
const attemptsFilter = ref({
  lessonId: null as number | null,
  status: "all" as "all" | "pending" | "done",
});

const filteredAttempts = computed(() => {
  let arr = attempts.value;
  if (attemptsFilter.value.lessonId) {
    arr = arr.filter((a) => a.lessonId === attemptsFilter.value.lessonId);
  }
  if (attemptsFilter.value.status === "pending") {
    arr = arr.filter((a) => a.isActive);
  } else if (attemptsFilter.value.status === "done") {
    arr = arr.filter((a) => !a.isActive);
  }
  return arr;
});

const fetchAttempts = () => {
  if (!isEdit.value) return;
  attemptsLoading.value = true;
  MyAttemptsService.AdminByCourse(id.value)
    .then((res) => {
      const d = res.data;
      attempts.value = Array.isArray(d) ? d : d?.data ?? [];
    })
    .catch(() => (attempts.value = []))
    .finally(() => (attemptsLoading.value = false));
};

const toggleAttempts = () => {
  attemptsOpen.value = !attemptsOpen.value;
  if (attemptsOpen.value && !attempts.value.length) fetchAttempts();
};

const scoreClass = (pct: number) => {
  if (pct >= 70) return "score--good";
  if (pct >= 50) return "score--mid";
  return "score--bad";
};

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString() : "");

const openResult = (attemptId: number) => {
  router.push({ name: "CardResultPage", params: { attemptId } });
};

// Question pool (shared for all lessons)
const allQuestions = ref<any[]>([]);
const questionsLoading = ref(false);

const loadAllQuestions = () => {
  questionsLoading.value = true;
  QuestionsService.GetQuestions(`Page=1&Size=500`)
    .then((r) => (allQuestions.value = r.data?.data ?? []))
    .catch(() => (allQuestions.value = []))
    .finally(() => (questionsLoading.value = false));
};

const filteredQuestionsFor = (lesson: InlineLesson) => {
  const s = lesson.test.questionSearch.trim().toLowerCase();
  if (!s) return allQuestions.value;
  return allQuestions.value.filter((q: any) =>
    q.questionText?.toLowerCase().includes(s),
  );
};

// --- File helpers ---
const onPick = (slot: PickedFile, e: Event) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  slot.file = f;
  slot.preview = f.name;
  slot.removed = false;
};
const removePicked = (slot: PickedFile) => {
  slot.file = null;
  slot.preview = "";
  slot.removed = true;
};
const uploadFile = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await FilesService.PostFiles(fd);
  return res.data?.fileName as string;
};

// --- Lesson mutations ---
const addLesson = () => {
  lessons.value.forEach((l) => (l.expanded = false));
  lessons.value.push(makeLesson());
};
const removeLesson = (idx: number) => {
  if (!confirm(t("confirmDeleteLesson"))) return;
  lessons.value.splice(idx, 1);
};
const toggleLesson = (idx: number) => {
  lessons.value[idx].expanded = !lessons.value[idx].expanded;
};

// Inline test mutations
const addPickedQuestion = (lesson: InlineLesson) => {
  if (!lesson.test.selectedQuestionId) return;
  const q = allQuestions.value.find((x: any) => x.id === lesson.test.selectedQuestionId);
  if (!q) return;
  if (lesson.test.questions.some((x) => x.questionId === q.id)) {
    notify({ text: t("includedQuestions"), type: "warn" });
    return;
  }
  lesson.test.questions.push({ questionId: q.id, questionText: q.questionText });
  lesson.test.selectedQuestionId = null;
  lesson.test.questionSearch = "";
};
const addDraftQuestion = async (lesson: InlineLesson) => {
  const d = lesson.test.draft;
  if (!d.questionText.trim()) {
    notify({ text: t("fieldNotEmpty"), type: "warn" });
    return;
  }
  const valid = d.choices.filter((c) => c.choiceText.trim());
  if (valid.length < 2) {
    notify({ text: t("atLeastTwoChoices"), type: "warn" });
    return;
  }
  if (!valid.some((c) => c.isCorrect)) {
    notify({ text: t("pickCorrectChoice"), type: "warn" });
    return;
  }
  // Upload question image if picked
  let fileId: string | undefined;
  if (d.image.file) {
    try {
      fileId = await uploadFile(d.image.file);
    } catch {
      return;
    }
  }
  const nq: { questionText: string; description: string; fileId?: string; choices: InlineChoice[] } = {
    questionText: d.questionText.trim(),
    description: d.description.trim(), // must be string — backend rejects null
    choices: valid.map((c) => ({ choiceText: c.choiceText.trim(), isCorrect: c.isCorrect })),
  };
  if (fileId) nq.fileId = fileId;
  lesson.test.questions.push({
    questionId: 0,
    questionText: d.questionText.trim(),
    newQuestion: nq,
  });
  lesson.test.draft = {
    questionText: "",
    description: "",
    image: newFile(),
    choices: [
      { choiceText: "", isCorrect: true },
      { choiceText: "", isCorrect: false },
    ],
  };
};
const removeQuestionFromLesson = (lesson: InlineLesson, idx: number) =>
  lesson.test.questions.splice(idx, 1);
const addChoice = (lesson: InlineLesson) => {
  if (lesson.test.draft.choices.length >= 6) return;
  lesson.test.draft.choices.push({ choiceText: "", isCorrect: false });
};
const removeChoice = (lesson: InlineLesson, idx: number) => {
  if (lesson.test.draft.choices.length <= 2) return;
  lesson.test.draft.choices.splice(idx, 1);
};
const setSingleCorrect = (lesson: InlineLesson, idx: number) =>
  lesson.test.draft.choices.forEach((c, i) => (c.isCorrect = i === idx));

// --- Save flow ---
const saveAll = async () => {
  if (!formModel.value.name.trim()) {
    notify({ text: t("courseName") + " — " + t("fieldNotEmpty"), type: "warn" });
    return;
  }
  // Validate that each new lesson has a name
  for (let i = 0; i < lessons.value.length; i++) {
    if (!lessons.value[i].name.trim()) {
      notify({
        text: `${i + 1}-${t("lessonName")} — ${t("fieldNotEmpty")}`,
        type: "warn",
      });
      lessons.value[i].expanded = true;
      return;
    }

    // Auto-add pending draft question if user typed but forgot "+"
    const l = lessons.value[i];
    const d = l.test.draft;
    const draftHasContent =
      d.questionText.trim() ||
      d.choices.some((c) => c.choiceText.trim());
    if (draftHasContent && l.test.mode === "create") {
      const before = l.test.questions.length;
      await addDraftQuestion(l);
      if (l.test.questions.length === before) {
        l.expanded = true;
        l.activeTab = "test";
        return; // validation failed inside addDraftQuestion
      }
    }

    // Test partially filled checks
    if (l.test.shortName.trim() && l.test.questions.length === 0) {
      notify({ text: `${i + 1}-${t("mavzu")}: ${t("testNeedsQuestions")}`, type: "warn" });
      l.expanded = true;
      l.activeTab = "test";
      return;
    }
    if (l.test.questions.length > 0 && !l.test.shortName.trim()) {
      notify({ text: `${i + 1}-${t("mavzu")}: ${t("testNeedsName")}`, type: "warn" });
      l.expanded = true;
      l.activeTab = "test";
      return;
    }
  }

  saveLoading.value = true;
  try {
    // 0) Course image upload
    let courseImageId: string | null | undefined = undefined;
    if (courseImageFile.value.file) {
      progressLabel.value = t("uploadingFiles");
      courseImageId = await uploadFile(courseImageFile.value.file);
    } else if (courseImageFile.value.removed && courseImageFile.value.existing) {
      courseImageId = null;
    }

    // 1) Course create or update
    let courseId: number | string = id.value;
    progressLabel.value = t("savingCourse");
    if (!isEdit.value) {
      const fd = new FormData();
      fd.append("Name", formModel.value.name);
      if (formModel.value.description) fd.append("Description", formModel.value.description);
      if (courseImageId) fd.append("ImageFileId", courseImageId);
      const res = await CoursesService.PostCourses(fd);
      courseId = res.data?.id ?? 0;
      notify({ text: t("courseCreated"), type: "success" });
    } else {
      await CoursesService.PutCourses(
        {
          name: formModel.value.name,
          description: formModel.value.description,
          imageFileId:
            courseImageId === undefined ? formModel.value.imageFileId : courseImageId,
        },
        id.value,
      );
      notify({ text: t("courseUpdated"), type: "success" });
    }

    // 2) Each new lesson
    for (let i = 0; i < lessons.value.length; i++) {
      const l = lessons.value[i];
      progressLabel.value = t("savingLessonN", { n: i + 1 });

      // Upload files
      let videoId: string | undefined, resourceId: string | undefined, assignmentId: string | undefined;
      if (l.videoFile.file) videoId = await uploadFile(l.videoFile.file);
      if (l.resourceFile.file) resourceId = await uploadFile(l.resourceFile.file);
      if (l.assignmentFile.file) assignmentId = await uploadFile(l.assignmentFile.file);

      const fd = new FormData();
      fd.append("CourseId", String(courseId));
      fd.append("Name", l.name);
      if (l.description) fd.append("Description", l.description);
      if (l.resourceText) fd.append("ResourceText", l.resourceText);
      if (l.assignmentText) fd.append("AssignmentText", l.assignmentText);
      if (videoId) fd.append("VideoFileId", videoId);
      if (resourceId) fd.append("ResourceFileId", resourceId);
      if (assignmentId) fd.append("AssignmentFileId", assignmentId);

      const lessonRes = await LessonsService.PostLesson(fd);
      const lessonId = lessonRes.data?.id;

      // Create CardTest if filled
      if (lessonId && l.test.shortName.trim() && l.test.questions.length > 0) {
        await CardTestsService.PostCardTests({
          shortName: l.test.shortName.trim(),
          fullName: (l.test.fullName || l.test.shortName).trim(),
          lessonId: +lessonId,
          cardTestQuestions: l.test.questions.map((q) =>
            q.newQuestion ? { newQuestion: q.newQuestion } : { questionId: q.questionId },
          ),
        });
      }
    }

    progressLabel.value = "";
    router.push({ name: "CardTests" });
  } catch (e) {
    setError(e as AxiosError<any>);
  } finally {
    saveLoading.value = false;
    progressLabel.value = "";
  }
};

// --- Data fetching ---
const fetchCourse = () => {
  if (!isEdit.value) return;
  loading.value = true;
  CoursesService.GetById(id.value)
    .then((res) => {
      formModel.value.name = res.data?.name ?? "";
      formModel.value.description = res.data?.description ?? "";
      formModel.value.imageFileId = res.data?.imageFileId ?? null;
      courseImageFile.value.existing = formModel.value.imageFileId;
    })
    .catch((e) => setError(e))
    .finally(() => (loading.value = false));
};

const imageUrl = computed(() => {
  if (courseImageFile.value.file) return URL.createObjectURL(courseImageFile.value.file);
  if (courseImageFile.value.existing && !courseImageFile.value.removed) {
    return FilesService.buildFileUrl(courseImageFile.value.existing, "coursesImage");
  }
  return "";
});

const fetchExistingLessons = () => {
  if (!isEdit.value) return;
  LessonsService.GetByCourse(id.value)
    .then((res) => {
      const data = res.data;
      existingLessons.value = Array.isArray(data) ? data : data?.data ?? [];
    })
    .catch(() => (existingLessons.value = []));
};

const goEditExistingLesson = (lessonId: number) => {
  router.push({ name: "EditLesson", params: { courseId: id.value, lessonId } });
};

const closeModal = () => router.push({ name: "CardTests" });

onMounted(() => {
  fetchCourse();
  fetchExistingLessons();
  loadAllQuestions();
});
</script>

<template>
  <div class="kurs-create">
    <!-- Header -->
    <div class="kurs-create__header">
      <h2 class="kurs-create__title">
        {{ isEdit ? (formModel.name || t("EditeMarkCategories")) : t("createCourse") }}
      </h2>
      <button type="button" class="kurs-create__close" @click="closeModal" aria-label="close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div v-if="loading" class="loading"><v-progress-circular indeterminate color="#5D87FF" /></div>

    <div v-else class="kurs-body">
      <!-- Course basic info -->
      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h3 class="panel-card__title">{{ t("courseInfo") }}</h3>
        </div>

        <div class="course-info">
          <!-- Image picker -->
          <div class="course-image">
            <div class="course-image__preview">
              <img v-if="imageUrl" :src="imageUrl" alt="cover" />
              <div v-else class="course-image__placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
            <div class="course-image__actions">
              <label class="image-btn image-btn--upload">
                <input type="file" accept="image/*" @change="onPick(courseImageFile, $event)" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>{{ imageUrl ? t("changeImage") : t("uploadImage") }}</span>
              </label>
              <button v-if="imageUrl" type="button" class="image-btn image-btn--remove" @click="removePicked(courseImageFile)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>{{ t("removeFile") }}</span>
              </button>
            </div>
            <div class="course-image__hint">{{ t("courseImageHint") }}</div>
          </div>

          <!-- Name + description -->
          <div class="course-fields">
            <label class="field-label">{{ t("courseName") }} <span class="required">*</span></label>
            <v-text-field v-model="formModel.name" variant="outlined" density="comfortable" hide-details :placeholder="t('courseName')" />

            <label class="field-label mt-3">{{ t("courseDescription") }}</label>
            <v-textarea v-model="formModel.description" variant="outlined" density="comfortable" rows="2" auto-grow hide-details />
          </div>
        </div>
      </div>

      <!-- Existing lessons (edit mode) -->
      <div v-if="isEdit && existingLessons.length" class="panel-card mt-3">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </div>
          <h3 class="panel-card__title">{{ t("existingLessons") }}</h3>
          <span class="count-chip ml-auto">{{ existingLessons.length }}</span>
        </div>
        <div class="existing-list">
          <div v-for="(l, idx) in existingLessons" :key="l.id" class="existing-item" @click="goEditExistingLesson(l.id)">
            <div class="existing-item__idx">{{ l.orderCode ?? idx + 1 }}</div>
            <div class="existing-item__body">
              <div class="existing-item__name">{{ l.name }}</div>
              <div class="existing-item__sub">{{ l.description || "—" }}</div>
            </div>
            <div class="existing-item__count">{{ l.testsCount ?? 0 }} {{ t("testTab") }}</div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- New lessons (inline) -->
      <div
        v-for="(lesson, idx) in lessons"
        :key="lesson.key"
        class="lesson-card"
      >
        <div class="lesson-card__header" @click="toggleLesson(idx)">
          <div class="lesson-card__badge">{{ idx + 1 }}-{{ t("mavzu") }}</div>
          <div class="lesson-card__name">
            {{ lesson.name || t("newLesson") }}
          </div>
          <button type="button" class="lesson-card__del" @click.stop="removeLesson(idx)" :title="t('deleteItem')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <svg class="lesson-card__chevron" :class="{ 'lesson-card__chevron--open': lesson.expanded }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div v-if="lesson.expanded" class="lesson-card__body">
          <!-- Lesson name -->
          <label class="field-label">{{ t("lessonName") }} <span class="required">*</span></label>
          <v-text-field v-model="lesson.name" variant="outlined" density="comfortable" hide-details :placeholder="t('lessonName')" />

          <!-- Inner tabs -->
          <div class="inner-tabs mt-3">
            <button
              v-for="tab in (['video','theory','test','resource','assignment'] as LessonTab[])"
              :key="tab"
              type="button"
              class="inner-tab"
              :class="{ 'inner-tab--active': lesson.activeTab === tab }"
              @click="lesson.activeTab = tab"
            >
              <span>{{
                tab === 'video' ? t('videoResourceTab') :
                tab === 'theory' ? t('theoryTab') :
                tab === 'test' ? t('testTab') :
                tab === 'resource' ? t('resourceTab') :
                t('assignmentTab')
              }}</span>
            </button>
          </div>

          <!-- Tab: Video -->
          <div v-if="lesson.activeTab === 'video'" class="inner-panel">
            <div class="upload-zone" :class="{ 'has-file': lesson.videoFile.preview }">
              <div class="upload-zone__label">
                <span>{{ t("videoFile") }}</span>
                <span class="upload-zone__hint">.mp4 · Max: 500MB</span>
              </div>
              <div v-if="lesson.videoFile.preview" class="upload-zone__picked">
                <span>📎 {{ lesson.videoFile.preview }}</span>
                <button type="button" class="remove-btn" @click="removePicked(lesson.videoFile)">×</button>
              </div>
              <label v-else class="upload-zone__drop">
                <input type="file" accept="video/mp4" @change="onPick(lesson.videoFile, $event)" />
                <div class="upload-zone__arrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="upload-zone__text">{{ t("chooseFile") }}</div>
              </label>
            </div>
          </div>

          <!-- Tab: Nazariy -->
          <div v-if="lesson.activeTab === 'theory'" class="inner-panel">
            <label class="field-label">{{ t("theoryText") }}</label>
            <v-textarea v-model="lesson.resourceText" variant="outlined" density="comfortable" rows="6" auto-grow hide-details :placeholder="t('theoryPlaceholder')" />
          </div>

          <!-- Tab: Test -->
          <div v-if="lesson.activeTab === 'test'" class="inner-panel">
            <v-row>
              <v-col cols="12" md="6">
                <label class="field-label">{{ t("shortName") }}</label>
                <v-text-field v-model="lesson.test.shortName" variant="outlined" density="comfortable" hide-details />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">{{ t("fullName") }}</label>
                <v-text-field v-model="lesson.test.fullName" variant="outlined" density="comfortable" hide-details />
              </v-col>
            </v-row>

            <div class="mode-tabs mt-3">
              <button type="button" class="mode-tab" :class="{ 'mode-tab--active': lesson.test.mode === 'pick' }" @click="lesson.test.mode = 'pick'">
                {{ t("pickExistingQuestion") }}
              </button>
              <button type="button" class="mode-tab" :class="{ 'mode-tab--active': lesson.test.mode === 'create' }" @click="lesson.test.mode = 'create'">
                {{ t("createNewQuestion") }}
              </button>
            </div>

            <div v-if="lesson.test.mode === 'pick'" class="question-picker__row mt-3">
              <v-autocomplete
                v-model="lesson.test.selectedQuestionId"
                v-model:search="lesson.test.questionSearch"
                :items="filteredQuestionsFor(lesson)"
                item-title="questionText"
                item-value="id"
                :placeholder="t('searchQuestion')"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                :loading="questionsLoading"
                class="question-picker__select"
              />
              <button type="button" class="btn-add" :disabled="!lesson.test.selectedQuestionId" @click="addPickedQuestion(lesson)">
                + {{ t("AddRow") }}
              </button>
            </div>

            <div v-else class="new-question mt-3">
              <label class="field-label">{{ t("questionText") }} <span class="required">*</span></label>
              <v-textarea v-model="lesson.test.draft.questionText" variant="outlined" density="comfortable" rows="2" auto-grow hide-details />

              <label class="field-label mt-3">{{ t("description") }}</label>
              <v-text-field v-model="lesson.test.draft.description" variant="outlined" density="comfortable" hide-details />

              <label class="field-label mt-3">{{ t("questionImage") }}</label>
              <label class="q-image-pick" :class="{ 'q-image-pick--has': lesson.test.draft.image.preview }">
                <input type="file" accept="image/*" @change="onPick(lesson.test.draft.image, $event)" />
                <template v-if="lesson.test.draft.image.preview">
                  <span>🖼 {{ lesson.test.draft.image.preview }}</span>
                  <button type="button" class="q-image-pick__x" @click.stop.prevent="removePicked(lesson.test.draft.image)">×</button>
                </template>
                <template v-else>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>{{ t("attachFile") }}</span>
                </template>
              </label>

              <div class="choices mt-3">
                <div class="choices__head">
                  <label class="field-label" style="margin-bottom: 0">{{ t("addChoice") }} <span class="required">*</span></label>
                  <button type="button" class="btn-ghost" @click="addChoice(lesson)" :disabled="lesson.test.draft.choices.length >= 6">
                    + {{ t("addChoice") }}
                  </button>
                </div>
                <div v-for="(c, cIdx) in lesson.test.draft.choices" :key="cIdx" class="choice-row" :class="{ 'choice-row--correct': c.isCorrect }">
                  <button type="button" class="choice-row__dot" :class="{ 'choice-row__dot--on': c.isCorrect }" @click="setSingleCorrect(lesson, cIdx)">
                    <svg v-if="c.isCorrect" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <v-text-field v-model="c.choiceText" variant="outlined" density="compact" hide-details :placeholder="t('choiceText') + ' ' + (cIdx + 1)" class="choice-row__input" />
                  <button type="button" class="choice-row__remove" :disabled="lesson.test.draft.choices.length <= 2" @click="removeChoice(lesson, cIdx)">×</button>
                </div>
              </div>

              <button type="button" class="btn-add mt-3" @click="addDraftQuestion(lesson)">+ {{ t("AddRow") }}</button>
            </div>

            <!-- Picked questions list -->
            <div v-if="lesson.test.questions.length" class="picked-list mt-3">
              <div v-for="(q, qIdx) in lesson.test.questions" :key="qIdx" class="picked-item" :class="{ 'picked-item--new': !!q.newQuestion }">
                <span class="picked-item__idx">{{ qIdx + 1 }}</span>
                <span class="picked-item__text">
                  {{ q.questionText }}
                  <span v-if="q.newQuestion" class="picked-item__badge">{{ t("newLabel") }}</span>
                </span>
                <button type="button" class="picked-item__remove" @click="removeQuestionFromLesson(lesson, qIdx)">×</button>
              </div>
            </div>
          </div>

          <!-- Tab: Resurs -->
          <div v-if="lesson.activeTab === 'resource'" class="inner-panel">
            <div class="upload-zone" :class="{ 'has-file': lesson.resourceFile.preview }">
              <div class="upload-zone__label">
                <span>{{ t("resourceFile") }}</span>
                <span class="upload-zone__hint">.pdf, .doc, .docx, .xls, .xlsx</span>
              </div>
              <div v-if="lesson.resourceFile.preview" class="upload-zone__picked">
                <span>📎 {{ lesson.resourceFile.preview }}</span>
                <button type="button" class="remove-btn" @click="removePicked(lesson.resourceFile)">×</button>
              </div>
              <label v-else class="upload-zone__drop">
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" @change="onPick(lesson.resourceFile, $event)" />
                <div class="upload-zone__arrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="upload-zone__text">{{ t("chooseFile") }}</div>
              </label>
            </div>
          </div>

          <!-- Tab: Topshiriq -->
          <div v-if="lesson.activeTab === 'assignment'" class="inner-panel">
            <label class="field-label">{{ t("assignmentText") }}</label>
            <v-textarea v-model="lesson.assignmentText" variant="outlined" density="comfortable" rows="4" auto-grow hide-details :placeholder="t('assignmentPlaceholder')" />

            <div class="upload-zone mt-3" :class="{ 'has-file': lesson.assignmentFile.preview }">
              <div class="upload-zone__label">
                <span>{{ t("assignmentFile") }}</span>
                <span class="upload-zone__hint">.pdf, .doc, .docx</span>
              </div>
              <div v-if="lesson.assignmentFile.preview" class="upload-zone__picked">
                <span>📎 {{ lesson.assignmentFile.preview }}</span>
                <button type="button" class="remove-btn" @click="removePicked(lesson.assignmentFile)">×</button>
              </div>
              <label v-else class="upload-zone__drop">
                <input type="file" accept=".pdf,.doc,.docx" @change="onPick(lesson.assignmentFile, $event)" />
                <div class="upload-zone__arrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="upload-zone__text">{{ t("chooseFile") }}</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Add lesson button -->
      <button type="button" class="add-lesson-btn" @click="addLesson">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>{{ t("addLesson") }}</span>
      </button>

      <!-- Admin: Attempts panel -->
      <div v-if="isEdit" class="panel-card attempts-panel">
        <div class="panel-card__header" @click="toggleAttempts" style="cursor: pointer">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3 class="panel-card__title">{{ t("attempts") }}</h3>
          <span v-if="attempts.length" class="count-chip ml-auto">{{ attempts.length }}</span>
          <svg class="attempts-chevron" :class="{ 'attempts-chevron--open': attemptsOpen }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div v-if="attemptsOpen">
          <div class="attempts-filters">
            <v-select
              v-model="attemptsFilter.lessonId"
              :items="existingLessons"
              item-title="name"
              item-value="id"
              :placeholder="t('selectLesson')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              class="attempts-filter"
            />
            <div class="status-toggle">
              <button type="button" class="status-toggle__btn" :class="{ 'status-toggle__btn--active': attemptsFilter.status === 'all' }" @click="attemptsFilter.status = 'all'">
                {{ t("allSubmissions") }}
              </button>
              <button type="button" class="status-toggle__btn" :class="{ 'status-toggle__btn--active': attemptsFilter.status === 'pending' }" @click="attemptsFilter.status = 'pending'">
                {{ t("inProgress") }}
              </button>
              <button type="button" class="status-toggle__btn" :class="{ 'status-toggle__btn--active': attemptsFilter.status === 'done' }" @click="attemptsFilter.status = 'done'">
                {{ t("finished") }}
              </button>
            </div>
          </div>

          <div v-if="attemptsLoading" class="empty-state"><v-progress-circular indeterminate size="28" /></div>
          <div v-else-if="!filteredAttempts.length" class="empty-state">{{ t("noAttempts") }}</div>

          <div v-else class="admin-attempts">
            <div v-for="(a, idx) in filteredAttempts" :key="a.id" class="admin-attempt">
              <div class="admin-attempt__idx">#{{ filteredAttempts.length - idx }}</div>
              <div class="admin-attempt__user">
                <div class="admin-attempt__name">{{ a.userFullName || a.userName || '—' }}</div>
                <div class="admin-attempt__meta">{{ a.lessonName }} · {{ a.cardTestShortName }}</div>
                <div class="admin-attempt__date">{{ fmtDate(a.startedDate) }}</div>
              </div>
              <div class="admin-attempt__score" :class="scoreClass(a.scorePercent)">
                <div class="admin-attempt__pct">{{ Math.round(a.scorePercent || 0) }}%</div>
                <div class="admin-attempt__raw">{{ a.correctAnswerCount }}/{{ a.questionsCount }}</div>
              </div>
              <div class="admin-attempt__status-col">
                <span v-if="a.isActive" class="admin-attempt__status admin-attempt__status--active">{{ t("inProgress") }}</span>
                <span v-else class="admin-attempt__status admin-attempt__status--done">{{ t("finished") }}</span>
                <button type="button" class="btn-ghost" @click="openResult(a.id)">{{ t("details") }} →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="kurs-footer">
      <button type="button" class="footer-btn footer-btn--back" @click="closeModal" :disabled="saveLoading">{{ t("back") }}</button>
      <button type="button" class="footer-btn footer-btn--save" :disabled="saveLoading" @click="saveAll">
        <template v-if="saveLoading">
          <v-progress-circular indeterminate size="16" width="2" color="white" />
          <span>{{ progressLabel || t("save") }}</span>
        </template>
        <template v-else>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ t("save") }}</span>
        </template>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kurs-create { background: white; border-radius: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); animation: fadeIn 0.25s ease;
  @media (max-width: 768px) { border-radius: 10px; } }
.kurs-create__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #F0F2F5;
  @media (max-width: 768px) { padding: 14px 16px; } }
.kurs-create__title { font-family: 'Poppins', sans-serif; font-size: 17px; font-weight: 600; color: #1F2937; margin: 0;
  @media (max-width: 480px) { font-size: 15px; } }
.kurs-create__close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #F3F4F6; border: none; border-radius: 50%; cursor: pointer; color: #6B7280; transition: all 0.2s;
  &:hover { background: #FEE2E2; color: #EF4444; } }
.loading { display: flex; align-items: center; justify-content: center; padding: 48px 0; }
.kurs-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;
  @media (max-width: 768px) { padding: 10px 12px; gap: 10px; } }
.panel-card { background: #FAFBFC; border: 1px solid #F0F2F5; border-radius: 12px; padding: 18px;
  @media (max-width: 768px) { padding: 14px 12px; border-radius: 10px; } }
.panel-card__header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.panel-card__icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  &--blue { background: #EFF4FF; color: #5D87FF; } }
.panel-card__title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: #1F2937; margin: 0; }
.field-label { display: block; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #1F2937; margin-bottom: 6px;
  .required { color: #EF4444; } }
.count-chip { display: inline-flex; padding: 3px 10px; background: #EFF4FF; color: #5D87FF; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; border-radius: 999px; }
.course-info { display: grid; grid-template-columns: 220px 1fr; gap: 18px; align-items: start;
  @media (max-width: 700px) { grid-template-columns: 1fr; } }
.course-image {
  &__preview { width: 220px; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden; background: #F3F4F6; border: 1px solid #E5E7EB;
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    @media (max-width: 700px) { width: 100%; } }
  &__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9CA3AF; }
  &__actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  &__hint { font-family: 'Poppins', sans-serif; font-size: 11px; color: #9CA3AF; margin-top: 6px; } }
.image-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  input { display: none; }
  &--upload { background: #5D87FF; color: white;
    &:hover { background: #4A73E8; } }
  &--remove { background: #FEE2E2; color: #EF4444;
    &:hover { background: #FCA5A5; color: white; } } }
.course-fields { display: flex; flex-direction: column; }
.existing-list { display: flex; flex-direction: column; gap: 8px; }
.existing-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; cursor: pointer; color: #6B7280; transition: all 0.2s;
  &:hover { border-color: #5D87FF; background: #F5F8FF; color: #5D87FF; }
  &__idx { width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #5D87FF; color: white; border-radius: 50%; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; }
  &__body { flex: 1; min-width: 0; }
  &__name { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #1F2937; }
  &__sub { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; }
  &__count { font-family: 'Poppins', sans-serif; font-size: 12px; color: #5D87FF; background: #EFF4FF; padding: 4px 10px; border-radius: 999px; font-weight: 600; } }

/* ===== Lesson card (inline) ===== */
.lesson-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; transition: all 0.2s;
  &:hover { border-color: #DBE4FF; } }
.lesson-card__header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #FAFBFC; cursor: pointer;
  &:hover { background: #F5F8FF; }
  @media (max-width: 480px) { padding: 12px; gap: 8px; } }
.lesson-card__badge { padding: 4px 10px; background: #5D87FF; color: white; border-radius: 999px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; flex-shrink: 0; white-space: nowrap; }
.lesson-card__name { flex: 1; min-width: 0; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #1F2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lesson-card__del { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  &:hover { background: #FCA5A5; color: white; } }
.lesson-card__chevron { color: #6B7280; transition: transform 0.2s;
  &--open { transform: rotate(180deg); } }
.lesson-card__body { padding: 16px; border-top: 1px solid #F0F2F5;
  @media (max-width: 480px) { padding: 12px; } }

.inner-tabs { display: flex; gap: 4px; background: #F3F4F6; padding: 3px; border-radius: 8px; overflow-x: auto;
  &::-webkit-scrollbar { display: none; } }
.inner-tab { flex: 1; min-width: max-content; padding: 7px 14px; border: none; background: transparent; border-radius: 6px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; white-space: nowrap; transition: all 0.2s;
  @media (max-width: 480px) { padding: 7px 10px; font-size: 11px; }
  &:hover { color: #5D87FF; }
  &--active { background: #5D87FF; color: white;
    &:hover { color: white; } } }
.inner-panel { margin-top: 14px; }

.upload-zone { background: #FAFBFC; border: 1.5px dashed #DBE4FF; border-radius: 10px; padding: 12px;
  &.has-file { border-style: solid; border-color: #BBF7D0; background: #F0FDF4; }
  &__label { display: flex; align-items: center; gap: 8px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #1F2937; margin-bottom: 10px; }
  &__hint { font-weight: 400; font-size: 11px; color: #9CA3AF; margin-left: auto; }
  &__drop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 20px 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s;
    &:hover { background: #F5F8FF; }
    input { display: none; } }
  &__arrow { width: 40px; height: 40px; border-radius: 50%; background: #EFF4FF; color: #5D87FF; display: flex; align-items: center; justify-content: center; }
  &__text { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #5D87FF; }
  &__picked { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937; } }
.remove-btn { margin-left: auto; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1;
  &:hover { background: #FCA5A5; color: white; } }

.mode-tabs { display: flex; gap: 4px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; padding: 3px; }
.mode-tab { flex: 1; padding: 7px 10px; background: transparent; border: none; border-radius: 7px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s;
  &--active { background: #EFF4FF; color: #5D87FF; } }
.question-picker__row { display: flex; gap: 10px; align-items: center;
  @media (max-width: 600px) { flex-direction: column; align-items: stretch; } }
.question-picker__select { flex: 1; }
.btn-add { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #5D87FF; color: white; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;
  &:hover:not(:disabled) { background: #4A73E8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; } }
.btn-ghost { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: none; color: #5D87FF; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
  &:hover { text-decoration: underline; } }

.choices__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.choice-row { display: flex; align-items: center; gap: 10px; padding: 8px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 6px; transition: all 0.2s;
  &--correct { border-color: #16A34A; background: #F0FDF4; }
  &__dot { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #D1D5DB; background: white; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #16A34A; flex-shrink: 0;
    &--on { border-color: #16A34A; background: #16A34A; color: white; } }
  &__input { flex: 1; }
  &__remove { width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1; flex-shrink: 0;
    &:hover:not(:disabled) { background: #FCA5A5; color: white; }
    &:disabled { opacity: 0.3; cursor: not-allowed; } } }

.q-image-pick { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: white; border: 1.5px dashed #DBE4FF; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #5D87FF; transition: all 0.2s;
  input { display: none; }
  &:hover { background: #EFF4FF; border-color: #5D87FF; }
  &--has { border-style: solid; border-color: #BBF7D0; background: #F0FDF4; color: #16A34A; }
  &__x { margin-left: auto; width: 22px; height: 22px; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 13px; line-height: 1; display: inline-flex; align-items: center; justify-content: center;
    &:hover { background: #FCA5A5; color: white; } } }
.picked-list { display: flex; flex-direction: column; gap: 6px; }
.picked-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border: 1px solid #E5E7EB; border-radius: 10px;
  &--new { border-color: #BBF7D0; background: #F0FDF4; }
  &__idx { width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; background: #EFF4FF; color: #5D87FF; border-radius: 50%; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  &__text { flex: 1; font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__badge { display: inline-block; margin-left: 6px; padding: 1px 8px; background: #16A34A; color: white; font-size: 10px; font-weight: 700; border-radius: 999px; vertical-align: middle; }
  &__remove { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1; flex-shrink: 0;
    &:hover { background: #FCA5A5; color: white; } } }

.add-lesson-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; width: 100%; background: transparent; border: 2px dashed #DBE4FF; color: #5D87FF; border-radius: 12px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.2s;
  &:hover { background: #F5F8FF; border-color: #5D87FF; } }

/* ===== Attempts panel ===== */
.attempts-panel { margin-top: 8px; }
.attempts-chevron { color: #6B7280; transition: transform 0.2s;
  &--open { transform: rotate(180deg); } }
.attempts-filters { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
  @media (max-width: 600px) { flex-direction: column; } }
.attempts-filter { min-width: 200px; font-family: 'Poppins', sans-serif; }
.status-toggle { display: inline-flex; padding: 3px; background: #F3F4F6; border-radius: 10px; gap: 2px;
  @media (max-width: 600px) { width: 100%; .status-toggle__btn { flex: 1; } } }
.status-toggle__btn { padding: 7px 14px; background: transparent; border: none; border-radius: 7px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  &:hover { color: #5D87FF; }
  &--active { background: white; color: #5D87FF; box-shadow: 0 1px 2px rgba(0,0,0,0.06); } }
.empty-state { padding: 22px; text-align: center; font-family: 'Poppins', sans-serif; font-size: 13px; color: #9CA3AF; background: white; border-radius: 10px; }

.admin-attempts { display: flex; flex-direction: column; gap: 8px; }
.admin-attempt { display: grid; grid-template-columns: 40px 1fr 110px 140px; align-items: center; gap: 12px; padding: 12px 14px; background: white; border: 1px solid #E5E7EB; border-radius: 10px;
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 8px; } }
.admin-attempt__idx { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; background: #5D87FF; color: white; border-radius: 50%; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
  @media (max-width: 768px) { display: none; } }
.admin-attempt__user { min-width: 0; }
.admin-attempt__name { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700; color: #1F2937; }
.admin-attempt__meta { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; margin-top: 2px; }
.admin-attempt__date { font-family: 'Poppins', sans-serif; font-size: 11px; color: #9CA3AF; margin-top: 2px; }
.admin-attempt__score { padding: 8px 12px; border-radius: 10px; text-align: center; background: #F9FAFB;
  &.score--good { background: #DCFCE7; color: #16A34A; }
  &.score--mid { background: #FEF3C7; color: #D97706; }
  &.score--bad { background: #FEE2E2; color: #EF4444; } }
.admin-attempt__pct { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 800; line-height: 1.1; }
.admin-attempt__raw { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; opacity: 0.85; }
.admin-attempt__status-col { display: flex; flex-direction: column; gap: 4px; align-items: flex-end;
  @media (max-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; } }
.admin-attempt__status { padding: 3px 10px; border-radius: 999px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
  &--active { background: #FEF3C7; color: #D97706; }
  &--done { background: #DCFCE7; color: #16A34A; } }

.kurs-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid #F0F2F5;
  @media (max-width: 480px) { padding: 12px 14px; gap: 8px;
    .footer-btn { flex: 1; } } }
.footer-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  @media (max-width: 480px) { padding: 10px 16px; font-size: 13px; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
  &--back { background: #FEE2E2; color: #EF4444;
    &:hover:not(:disabled) { background: #FCA5A5; color: white; } }
  &--save { background: #5D87FF; color: white; min-width: 140px; justify-content: center;
    &:hover:not(:disabled) { background: #4A73E8; } } }

.ml-auto { margin-left: auto; }
.mt-3 { margin-top: 12px; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
