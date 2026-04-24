<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { LessonModel, LessonFileFolder } from "./lessonTypes";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { setError } from "@/utils/helpers";
import { LessonsService } from "@/services/services/Lessons.service";
import { FilesService } from "@/services/services/Files.service";
import { CardTestsService } from "@/services/services/CardTests.service";
import { QuestionsService } from "@/services/services/Questions";
import type { AxiosError } from "axios";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const courseId = computed(() => String(route.params.courseId));
const lessonId = computed(() => String(route.params.lessonId));
const isEdit = computed(() => +String(lessonId.value) > 0);

const activeTab = ref<"video" | "test" | "theory" | "resource" | "assignment">(
  "video",
);

const formModel = ref<LessonModel>({
  courseId: +courseId.value,
  name: "",
  description: "",
  videoFileId: null,
  resourceFileId: null,
  resourceText: "",
  assignmentFileId: null,
  assignmentText: "",
});

type PickedFile = {
  file: File | null;
  preview: string;
  existing: string | null;
  removed: boolean;
};

const newFile = (): PickedFile => ({
  file: null,
  preview: "",
  existing: null,
  removed: false,
});

const videoFile = ref<PickedFile>(newFile());
const resourceFile = ref<PickedFile>(newFile());
const assignmentFile = ref<PickedFile>(newFile());

const loading = ref(false);
const saveLoading = ref(false);
const uploadingLabel = ref<string>("");
const lessonTests = ref<any[]>([]);

// Inline test creation
interface InlineChoice { choiceText: string; isCorrect: boolean; }
interface InlineQuestion {
  questionId: number;
  questionText: string;
  newQuestion?: { questionText: string; description?: string; choices: InlineChoice[] };
}
const newTest = ref({
  shortName: "",
  fullName: "",
  questions: [] as InlineQuestion[],
});

const questionMode = ref<"pick" | "create">("pick");
const newQuestionDraft = ref({
  questionText: "",
  description: "",
  choices: [
    { choiceText: "", isCorrect: true },
    { choiceText: "", isCorrect: false },
  ] as InlineChoice[],
});
const allQuestions = ref<any[]>([]);
const questionsLoading = ref(false);
const selectedQuestionId = ref<number | null>(null);
const questionSearch = ref("");

const filteredQuestions = computed(() => {
  const s = questionSearch.value.trim().toLowerCase();
  if (!s) return allQuestions.value;
  return allQuestions.value.filter((q: any) => q.questionText?.toLowerCase().includes(s));
});

const loadAllQuestions = () => {
  questionsLoading.value = true;
  QuestionsService.GetQuestions(`Page=1&Size=500`)
    .then((r) => (allQuestions.value = r.data?.data ?? []))
    .catch(() => (allQuestions.value = []))
    .finally(() => (questionsLoading.value = false));
};

const addInlineQuestion = () => {
  if (!selectedQuestionId.value) return;
  const q = allQuestions.value.find((x: any) => x.id === selectedQuestionId.value);
  if (!q) return;
  if (newTest.value.questions.some((x) => x.questionId === q.id)) {
    notify({ text: t("includedQuestions"), type: "warn" });
    return;
  }
  newTest.value.questions.push({ questionId: q.id, questionText: q.questionText });
  selectedQuestionId.value = null;
  questionSearch.value = "";
};
const removeInlineQuestion = (idx: number) => newTest.value.questions.splice(idx, 1);

const addChoice = () => {
  if (newQuestionDraft.value.choices.length >= 6) return;
  newQuestionDraft.value.choices.push({ choiceText: "", isCorrect: false });
};
const removeChoice = (idx: number) => {
  if (newQuestionDraft.value.choices.length <= 2) return;
  newQuestionDraft.value.choices.splice(idx, 1);
};
const setSingleCorrect = (idx: number) =>
  newQuestionDraft.value.choices.forEach((c, i) => (c.isCorrect = i === idx));

const resetDraft = () => {
  newQuestionDraft.value = {
    questionText: "",
    description: "",
    choices: [
      { choiceText: "", isCorrect: true },
      { choiceText: "", isCorrect: false },
    ],
  };
};

const addDraftQuestion = () => {
  const d = newQuestionDraft.value;
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
  newTest.value.questions.push({
    questionId: 0,
    questionText: d.questionText.trim(),
    newQuestion: {
      questionText: d.questionText.trim(),
      description: d.description.trim(), // must be string — backend rejects null
      choices: valid.map((c) => ({ choiceText: c.choiceText.trim(), isCorrect: c.isCorrect })),
    },
  });
  resetDraft();
};

const hasPendingTest = computed(
  () => newTest.value.shortName.trim() && newTest.value.questions.length > 0,
);

// File picker helpers
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

const uploadFile = async (file: File, label: string): Promise<string> => {
  uploadingLabel.value = label;
  const fd = new FormData();
  fd.append("file", file);
  const res = await FilesService.PostFiles(fd);
  return res.data?.fileName as string;
};

const resolveFileId = async (
  slot: PickedFile,
  label: string,
): Promise<string | null | undefined> => {
  if (slot.file) return await uploadFile(slot.file, label);
  if (slot.removed && slot.existing) return null;
  return slot.existing ?? undefined;
};

const validateBeforeSave = () => {
  if (!formModel.value.name?.trim()) {
    notify({ text: t("lessonName") + " — " + t("fieldNotEmpty"), type: "warn" });
    activeTab.value = "video";
    return false;
  }
  return true;
};

const saveData = async () => {
  if (!validateBeforeSave()) return;

  // Auto-add draft question if user typed but forgot to click "+"
  const d = newQuestionDraft.value;
  const draftHasContent =
    d.questionText.trim() ||
    d.choices.some((c) => c.choiceText.trim());
  if (draftHasContent && questionMode.value === "create") {
    // Try adding — if validation fails, warn and stop
    const before = newTest.value.questions.length;
    addDraftQuestion();
    if (newTest.value.questions.length === before) {
      // validation failed; notify already shown
      return;
    }
  }

  // If test name filled but no questions, warn
  if (newTest.value.shortName.trim() && newTest.value.questions.length === 0) {
    notify({ text: t("testNeedsQuestions"), type: "warn" });
    return;
  }
  // If questions added but test name empty, warn
  if (newTest.value.questions.length > 0 && !newTest.value.shortName.trim()) {
    notify({ text: t("testNeedsName"), type: "warn" });
    return;
  }

  saveLoading.value = true;
  try {
    const videoId = await resolveFileId(videoFile.value, t("videoFile"));
    const resourceId = await resolveFileId(resourceFile.value, t("resourceFile"));
    const assignmentId = await resolveFileId(assignmentFile.value, t("assignmentFile"));
    uploadingLabel.value = "";

    let resolvedLessonId: number | string = lessonId.value;

    if (!isEdit.value) {
      const fd = new FormData();
      fd.append("CourseId", String(courseId.value));
      fd.append("Name", formModel.value.name);
      if (formModel.value.description) fd.append("Description", formModel.value.description);
      if (formModel.value.resourceText) fd.append("ResourceText", formModel.value.resourceText);
      if (formModel.value.assignmentText) fd.append("AssignmentText", formModel.value.assignmentText);
      if (videoId) fd.append("VideoFileId", videoId);
      if (resourceId) fd.append("ResourceFileId", resourceId);
      if (assignmentId) fd.append("AssignmentFileId", assignmentId);

      const res = await LessonsService.PostLesson(fd);
      resolvedLessonId = res.data?.id ?? 0;
      notify({ text: t("lessonCreated"), type: "success" });
    } else {
      const payload: Record<string, any> = {
        courseId: +courseId.value,
        name: formModel.value.name,
        description: formModel.value.description ?? "",
        resourceText: formModel.value.resourceText ?? "",
        assignmentText: formModel.value.assignmentText ?? "",
        videoFileId: videoId === undefined ? formModel.value.videoFileId : videoId,
        resourceFileId: resourceId === undefined ? formModel.value.resourceFileId : resourceId,
        assignmentFileId: assignmentId === undefined ? formModel.value.assignmentFileId : assignmentId,
      };
      await LessonsService.PutLesson(payload, lessonId.value);
      notify({ text: t("lessonUpdated"), type: "success" });
    }

    // Inline test
    if (hasPendingTest.value && resolvedLessonId && +resolvedLessonId > 0) {
      try {
        await CardTestsService.PostCardTests({
          shortName: newTest.value.shortName.trim(),
          fullName: (newTest.value.fullName || newTest.value.shortName).trim(),
          lessonId: +resolvedLessonId,
          cardTestQuestions: newTest.value.questions.map((q) =>
            q.newQuestion ? { newQuestion: q.newQuestion } : { questionId: q.questionId },
          ),
        });
        notify({ text: t("testSavedInline"), type: "success" });
        newTest.value = { shortName: "", fullName: "", questions: [] };
      } catch (err) {
        setError(err as AxiosError<any>);
      }
    }

    router.push({ name: "EditCardTests", params: { id: courseId.value } });
  } catch (e) {
    setError(e as AxiosError<any>);
  } finally {
    saveLoading.value = false;
    uploadingLabel.value = "";
  }
};

const fileUrl = (fileName: string, folder: LessonFileFolder) =>
  FilesService.buildFileUrl(fileName, folder);

const fetchLesson = () => {
  if (!isEdit.value) return;
  loading.value = true;
  LessonsService.GetById(lessonId.value)
    .then((res) => {
      formModel.value = {
        courseId: res.data?.courseId ?? +courseId.value,
        name: res.data?.name ?? "",
        description: res.data?.description ?? "",
        orderCode: res.data?.orderCode,
        resourceText: res.data?.resourceText ?? "",
        assignmentText: res.data?.assignmentText ?? "",
        videoFileId: res.data?.videoFileId ?? null,
        resourceFileId: res.data?.resourceFileId ?? null,
        assignmentFileId: res.data?.assignmentFileId ?? null,
      };
      videoFile.value.existing = formModel.value.videoFileId ?? null;
      resourceFile.value.existing = formModel.value.resourceFileId ?? null;
      assignmentFile.value.existing = formModel.value.assignmentFileId ?? null;
    })
    .catch((e) => setError(e))
    .finally(() => (loading.value = false));
};

const fetchLessonTests = () => {
  if (!isEdit.value) {
    lessonTests.value = [];
    return;
  }
  CardTestsService.GetCardTests(`Page=1&Size=100&LessonId=${lessonId.value}`)
    .then((res) => (lessonTests.value = res.data?.data ?? []))
    .catch(() => (lessonTests.value = []));
};

const closeModal = () =>
  router.push({ name: "EditCardTests", params: { id: courseId.value } });

onMounted(() => {
  fetchLesson();
  fetchLessonTests();
  loadAllQuestions();
});

const tabs = computed(() => [
  { id: "video", label: t("videoResourceTab"), icon: "video" },
  { id: "test", label: t("testTab"), icon: "edit" },
  { id: "theory", label: t("theoryTab"), icon: "book" },
  { id: "resource", label: t("resourceTab"), icon: "paperclip" },
  { id: "assignment", label: t("assignmentTab"), icon: "clipboard" },
]);
</script>

<template>
  <div class="kurs-create">
    <div class="kurs-create__header">
      <div>
        <div class="kurs-create__crumb">{{ t("course") }} #{{ courseId }}</div>
        <h2 class="kurs-create__title">
          {{ isEdit ? (formModel.name || t("editLesson")) : t("newLesson") }}
        </h2>
      </div>
      <button type="button" class="kurs-create__close" @click="closeModal" aria-label="close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="kurs-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="kurs-tab"
        :class="{ 'kurs-tab--active': activeTab === tab.id }"
        @click="activeTab = tab.id as any"
      >
        <span class="kurs-tab__icon">
          <svg v-if="tab.icon === 'video'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          <svg v-else-if="tab.icon === 'edit'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          <svg v-else-if="tab.icon === 'book'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <svg v-else-if="tab.icon === 'paperclip'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          <svg v-else-if="tab.icon === 'clipboard'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z"/><rect x="5" y="4" width="14" height="18" rx="2"/></svg>
        </span>
        <span class="kurs-tab__label">{{ tab.label }}</span>
      </button>
    </div>

    <div v-if="loading" class="loading"><v-progress-circular indeterminate color="#5D87FF" /></div>

    <!-- Tab: Video -->
    <section v-show="!loading && activeTab === 'video'" class="tab-panel">
      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("videoResourceSection") }}</h3>
        </div>

        <label class="field-label">{{ t("lessonName") }} <span class="required">*</span></label>
        <v-text-field v-model="formModel.name" variant="outlined" density="comfortable" hide-details="auto" :placeholder="t('lessonName')" />

        <label class="field-label mt-4">{{ t("courseDescription") }}</label>
        <v-textarea v-model="formModel.description" variant="outlined" density="comfortable" rows="3" auto-grow hide-details="auto" />

        <div class="upload-zone mt-4" :class="{ 'has-file': videoFile.preview || (videoFile.existing && !videoFile.removed) }">
          <div class="upload-zone__label">
            <span>{{ t("videoFile") }}</span>
            <span class="upload-zone__hint">Max: 500MB</span>
          </div>
          <div v-if="videoFile.preview" class="upload-zone__picked">
            <span>📎 {{ videoFile.preview }}</span>
            <button type="button" class="remove-btn" @click="removePicked(videoFile)">×</button>
          </div>
          <div v-else-if="videoFile.existing && !videoFile.removed" class="upload-zone__picked">
            <a :href="fileUrl(videoFile.existing, 'lessonsVideo')" target="_blank" rel="noopener">🎞 {{ t("watchVideo") }}</a>
            <button type="button" class="remove-btn" @click="removePicked(videoFile)">×</button>
          </div>
          <label v-else class="upload-zone__drop">
            <input type="file" accept="video/mp4" @change="onPick(videoFile, $event)" />
            <div class="upload-zone__arrow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="upload-zone__text">{{ t("chooseFile") }}</div>
          </label>
        </div>
      </div>
    </section>

    <!-- Tab: Test -->
    <section v-show="!loading && activeTab === 'test'" class="tab-panel">
      <div v-if="isEdit && lessonTests.length" class="panel-card mb-3">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("courseTests") }}</h3>
          <span class="count-chip ml-auto">{{ lessonTests.length }}</span>
        </div>
        <div class="test-list">
          <div v-for="(test, idx) in lessonTests" :key="test.id" class="test-item">
            <div class="test-item__index">{{ idx + 1 }}</div>
            <div class="test-item__body">
              <div class="test-item__name">{{ test.shortName }}</div>
              <div class="test-item__sub">{{ test.fullName }}</div>
            </div>
            <div class="test-item__count">{{ (test.cardTestQuestions?.length ?? 0) }} {{ t("question") }}</div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("createTest") }}</h3>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("shortName") }}</label>
            <v-text-field v-model="newTest.shortName" variant="outlined" density="comfortable" hide-details />
          </v-col>
          <v-col cols="12" md="6">
            <label class="field-label">{{ t("fullName") }}</label>
            <v-text-field v-model="newTest.fullName" variant="outlined" density="comfortable" hide-details />
          </v-col>
        </v-row>

        <div class="question-picker">
          <div class="mode-tabs">
            <button type="button" class="mode-tab" :class="{ 'mode-tab--active': questionMode === 'pick' }" @click="questionMode = 'pick'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              {{ t("pickExistingQuestion") }}
            </button>
            <button type="button" class="mode-tab" :class="{ 'mode-tab--active': questionMode === 'create' }" @click="questionMode = 'create'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ t("createNewQuestion") }}
            </button>
          </div>

          <div v-if="questionMode === 'pick'" class="question-picker__row">
            <v-autocomplete v-model="selectedQuestionId" v-model:search="questionSearch" :items="filteredQuestions" item-title="questionText" item-value="id" :placeholder="t('searchQuestion')" variant="outlined" density="comfortable" hide-details clearable :loading="questionsLoading" class="question-picker__select" />
            <button type="button" class="btn-add" :disabled="!selectedQuestionId" @click="addInlineQuestion">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>{{ t("AddRow") }}</span>
            </button>
          </div>

          <div v-else class="new-question">
            <label class="field-label">{{ t("questionText") }} <span class="required">*</span></label>
            <v-textarea v-model="newQuestionDraft.questionText" variant="outlined" density="comfortable" rows="2" auto-grow hide-details />

            <label class="field-label mt-3">{{ t("description") }}</label>
            <v-text-field v-model="newQuestionDraft.description" variant="outlined" density="comfortable" hide-details />

            <div class="choices">
              <div class="choices__head">
                <label class="field-label" style="margin-bottom: 0">{{ t("addChoice") }} <span class="required">*</span></label>
                <button type="button" class="btn-ghost" @click="addChoice" :disabled="newQuestionDraft.choices.length >= 6">+ {{ t("addChoice") }}</button>
              </div>
              <div v-for="(c, idx) in newQuestionDraft.choices" :key="idx" class="choice-row" :class="{ 'choice-row--correct': c.isCorrect }">
                <button type="button" class="choice-row__dot" :class="{ 'choice-row__dot--on': c.isCorrect }" @click="setSingleCorrect(idx)">
                  <svg v-if="c.isCorrect" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <v-text-field v-model="c.choiceText" variant="outlined" density="compact" hide-details :placeholder="t('choiceText') + ' ' + (idx + 1)" class="choice-row__input" />
                <button type="button" class="choice-row__remove" :disabled="newQuestionDraft.choices.length <= 2" @click="removeChoice(idx)">×</button>
              </div>
            </div>

            <button type="button" class="btn-add mt-3" @click="addDraftQuestion">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>{{ t("AddRow") }}</span>
            </button>
          </div>
        </div>

        <div v-if="newTest.questions.length" class="picked-list mt-3">
          <div v-for="(q, idx) in newTest.questions" :key="idx" class="picked-item" :class="{ 'picked-item--new': !!q.newQuestion }">
            <span class="picked-item__idx">{{ idx + 1 }}</span>
            <span class="picked-item__text">
              {{ q.questionText }}
              <span v-if="q.newQuestion" class="picked-item__badge">{{ t("newLabel") }}</span>
            </span>
            <button type="button" class="picked-item__remove" @click="removeInlineQuestion(idx)">×</button>
          </div>
        </div>
        <div v-else class="picked-empty">{{ t("pickQuestionsHint") }}</div>
      </div>
    </section>

    <!-- Tab: Nazariy -->
    <section v-show="!loading && activeTab === 'theory'" class="tab-panel">
      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("theorySection") }}</h3>
        </div>
        <label class="field-label">{{ t("theoryText") }}</label>
        <v-textarea v-model="formModel.resourceText" variant="outlined" density="comfortable" rows="8" auto-grow hide-details="auto" :placeholder="t('theoryPlaceholder')" />
      </div>
    </section>

    <!-- Tab: Resurs -->
    <section v-show="!loading && activeTab === 'resource'" class="tab-panel">
      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("resourceFile") }}</h3>
        </div>
        <div class="upload-zone" :class="{ 'has-file': resourceFile.preview || (resourceFile.existing && !resourceFile.removed) }">
          <div class="upload-zone__label">
            <span>{{ t("resourceFile") }}</span>
            <span class="upload-zone__hint">.pdf, .doc, .docx, .xls, .xlsx</span>
          </div>
          <div v-if="resourceFile.preview" class="upload-zone__picked">
            <span>📎 {{ resourceFile.preview }}</span>
            <button type="button" class="remove-btn" @click="removePicked(resourceFile)">×</button>
          </div>
          <div v-else-if="resourceFile.existing && !resourceFile.removed" class="upload-zone__picked">
            <a :href="fileUrl(resourceFile.existing, 'lessonsResource')" target="_blank" rel="noopener">📎 {{ t("downloadResource") }}</a>
            <button type="button" class="remove-btn" @click="removePicked(resourceFile)">×</button>
          </div>
          <label v-else class="upload-zone__drop">
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" @change="onPick(resourceFile, $event)" />
            <div class="upload-zone__arrow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="upload-zone__text">{{ t("chooseFile") }}</div>
          </label>
        </div>
      </div>
    </section>

    <!-- Tab: Topshiriq -->
    <section v-show="!loading && activeTab === 'assignment'" class="tab-panel">
      <div class="panel-card">
        <div class="panel-card__header">
          <div class="panel-card__icon panel-card__icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z"/><rect x="5" y="4" width="14" height="18" rx="2"/></svg>
          </div>
          <h3 class="panel-card__title">{{ t("assignmentFile") }}</h3>
        </div>
        <label class="field-label">{{ t("assignmentText") }}</label>
        <v-textarea v-model="formModel.assignmentText" variant="outlined" density="comfortable" rows="5" auto-grow hide-details="auto" :placeholder="t('assignmentPlaceholder')" />

        <div class="upload-zone mt-4" :class="{ 'has-file': assignmentFile.preview || (assignmentFile.existing && !assignmentFile.removed) }">
          <div class="upload-zone__label">
            <span>{{ t("assignmentFile") }}</span>
            <span class="upload-zone__hint">.pdf, .doc, .docx</span>
          </div>
          <div v-if="assignmentFile.preview" class="upload-zone__picked">
            <span>📎 {{ assignmentFile.preview }}</span>
            <button type="button" class="remove-btn" @click="removePicked(assignmentFile)">×</button>
          </div>
          <div v-else-if="assignmentFile.existing && !assignmentFile.removed" class="upload-zone__picked">
            <a :href="fileUrl(assignmentFile.existing, 'lessonsAssignment')" target="_blank" rel="noopener">📎 {{ t("downloadAssignment") }}</a>
            <button type="button" class="remove-btn" @click="removePicked(assignmentFile)">×</button>
          </div>
          <label v-else class="upload-zone__drop">
            <input type="file" accept=".pdf,.doc,.docx" @change="onPick(assignmentFile, $event)" />
            <div class="upload-zone__arrow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="upload-zone__text">{{ t("chooseFile") }}</div>
          </label>
        </div>
      </div>
    </section>

    <div class="kurs-footer">
      <button type="button" class="footer-btn footer-btn--back" @click="closeModal" :disabled="saveLoading">{{ t("back") }}</button>
      <button type="button" class="footer-btn footer-btn--save" :disabled="saveLoading" @click="saveData">
        <template v-if="saveLoading">
          <v-progress-circular indeterminate size="16" width="2" color="white" />
          <span>{{ uploadingLabel ? t("uploadingFiles") : t("save") }}</span>
        </template>
        <template v-else>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{{ isEdit ? t("save") : t("AddRow") }}</span>
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
.kurs-create__crumb { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #5D87FF; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
.kurs-create__title { font-family: 'Poppins', sans-serif; font-size: 17px; font-weight: 600; color: #1F2937; margin: 0; }
.kurs-create__close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #F3F4F6; border: none; border-radius: 50%; cursor: pointer; color: #6B7280; transition: all 0.2s;
  &:hover { background: #FEE2E2; color: #EF4444; } }
.kurs-tabs { display: flex; gap: 6px; padding: 14px 16px 0; overflow-x: auto;
  &::-webkit-scrollbar { display: none; } }
.kurs-tab { flex: 1; min-width: max-content; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; background: #FAFBFC; border: 1px solid #E5E7EB; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #6B7280; transition: all 0.2s; white-space: nowrap;
  @media (max-width: 480px) { padding: 8px 10px; font-size: 11px;
    .kurs-tab__label { display: none; } }
  &:hover { background: #F0F4FF; color: #5D87FF; }
  &--active { background: #5D87FF; color: white; border-color: #5D87FF;
    &:hover { background: #4A73E8; color: white; } }
  &__icon { display: inline-flex; align-items: center; } }
.tab-panel { padding: 14px 16px;
  @media (max-width: 480px) { padding: 10px 12px; } }
.panel-card { background: #FAFBFC; border: 1px solid #F0F2F5; border-radius: 12px; padding: 18px;
  @media (max-width: 480px) { padding: 14px 12px; border-radius: 10px; } }
.panel-card__header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.panel-card__icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  &--blue { background: #EFF4FF; color: #5D87FF; }
  &--amber { background: #FEF3C7; color: #D97706; }
  &--green { background: #DCFCE7; color: #16A34A; } }
.panel-card__title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: #1F2937; margin: 0; }
.field-label { display: block; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #1F2937; margin-bottom: 6px; .required { color: #EF4444; } }
.upload-zone { background: white; border: 1.5px dashed #DBE4FF; border-radius: 10px; padding: 14px;
  &.has-file { border-style: solid; border-color: #BBF7D0; background: #F0FDF4; }
  &__label { display: flex; align-items: center; gap: 8px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #1F2937; margin-bottom: 12px; }
  &__hint { font-weight: 400; font-size: 12px; color: #9CA3AF; margin-left: auto; }
  &__drop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 28px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s;
    &:hover { background: #F5F8FF; } input { display: none; } }
  &__arrow { width: 44px; height: 44px; border-radius: 50%; background: #EFF4FF; color: #5D87FF; display: flex; align-items: center; justify-content: center; }
  &__text { font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: #5D87FF; }
  &__picked { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937;
    a { color: #5D87FF; text-decoration: none; &:hover { text-decoration: underline; } } } }
.remove-btn { margin-left: auto; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1;
  &:hover { background: #FCA5A5; color: white; } }
.test-list { display: flex; flex-direction: column; gap: 8px; }
.test-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: white; border: 1px solid #E5E7EB; border-radius: 10px;
  &__index { width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #5D87FF; color: white; border-radius: 50%; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; }
  &__body { flex: 1; min-width: 0; }
  &__name { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #1F2937; }
  &__sub { font-family: 'Poppins', sans-serif; font-size: 12px; color: #6B7280; }
  &__count { font-family: 'Poppins', sans-serif; font-size: 12px; color: #5D87FF; background: #EFF4FF; padding: 4px 10px; border-radius: 999px; font-weight: 600; } }
.btn-add { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: #5D87FF; color: white; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;
  &:hover:not(:disabled) { background: #4A73E8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; } }
.btn-ghost { display: inline-flex; align-items: center; gap: 4px; background: transparent; border: none; color: #5D87FF; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
  &:hover { text-decoration: underline; } }
.count-chip { display: inline-flex; padding: 3px 10px; background: #EFF4FF; color: #5D87FF; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; border-radius: 999px; }
.mb-3 { margin-bottom: 14px; }
.kurs-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid #F0F2F5;
  @media (max-width: 480px) { padding: 12px 14px; gap: 8px;
    .footer-btn { flex: 1; } } }
.footer-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  @media (max-width: 480px) { padding: 10px 14px; font-size: 13px; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
  &--back { background: #FEE2E2; color: #EF4444;
    &:hover:not(:disabled) { background: #FCA5A5; color: white; } }
  &--save { background: #5D87FF; color: white; min-width: 120px; justify-content: center;
    &:hover:not(:disabled) { background: #4A73E8; } } }
.loading { display: flex; align-items: center; justify-content: center; padding: 48px 0; }
.mode-tabs { display: flex; gap: 6px; margin-bottom: 12px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; padding: 4px; }
.mode-tab { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; color: #6B7280; transition: all 0.2s;
  &:hover { color: #5D87FF; }
  &--active { background: #EFF4FF; color: #5D87FF; } }
.question-picker { margin-top: 14px;
  &__row { display: flex; gap: 10px; align-items: center;
    @media (max-width: 600px) { flex-direction: column; align-items: stretch; .btn-add { width: 100%; justify-content: center; } } }
  &__select { flex: 1; font-family: 'Poppins', sans-serif; } }
.new-question { display: flex; flex-direction: column; }
.choices { margin-top: 14px;
  &__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; } }
.choice-row { display: flex; align-items: center; gap: 10px; padding: 8px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 6px; transition: all 0.2s;
  &--correct { border-color: #16A34A; background: #F0FDF4; }
  &__dot { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #D1D5DB; background: white; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #16A34A; flex-shrink: 0; transition: all 0.2s;
    &--on { border-color: #16A34A; background: #16A34A; color: white; }
    &:hover { border-color: #16A34A; } }
  &__input { flex: 1; font-family: 'Poppins', sans-serif; }
  &__remove { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1; flex-shrink: 0;
    &:hover:not(:disabled) { background: #FCA5A5; color: white; }
    &:disabled { opacity: 0.3; cursor: not-allowed; } } }
.picked-list { display: flex; flex-direction: column; gap: 6px; }
.picked-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border: 1px solid #E5E7EB; border-radius: 10px;
  &--new { border-color: #BBF7D0; background: #F0FDF4; }
  &__idx { width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; background: #EFF4FF; color: #5D87FF; border-radius: 50%; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  &__text { flex: 1; font-family: 'Poppins', sans-serif; font-size: 13px; color: #1F2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__badge { display: inline-block; margin-left: 6px; padding: 1px 8px; background: #16A34A; color: white; font-size: 10px; font-weight: 700; border-radius: 999px; vertical-align: middle; }
  &__remove { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 50%; cursor: pointer; font-weight: 700; font-size: 14px; line-height: 1; flex-shrink: 0;
    &:hover { background: #FCA5A5; color: white; } } }
.picked-empty { margin-top: 10px; padding: 14px; text-align: center; font-family: 'Poppins', sans-serif; font-size: 12px; color: #9CA3AF; background: white; border: 1px dashed #E5E7EB; border-radius: 10px; }
.ml-auto { margin-left: auto; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 14px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>
