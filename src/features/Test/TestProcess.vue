<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { ICategoryAttempData, IPostAttemp, MyCategories } from "./types";
import { AttemptService } from "@/services/services/Attempts.service";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";
import defaultImage from '@/assets/images/car.jpg';

interface IProps {
  category: MyCategories;
  modelValue: boolean;
  view?: boolean;
  continueTest?: boolean;
}
const props = defineProps<IProps>();
const { category, view, continueTest } = toRefs(props);
const emits = defineEmits(["update:modelValue"]);

const attempt = ref<ICategoryAttempData[]>([]);
const activeQuestionIndex = ref(0);
const saveLoading = ref(false);
const selected = ref<number | null>(null);
const isDescriptionVisible = ref(false);

const activeQuestion = computed(() => attempt.value[activeQuestionIndex.value]);

const fetchAttemp = () => {
  if (view.value) return;
  
  const url = continueTest.value
    ? `/${category.value.id}/attempts/${category.value.attemptId}`
    : `/${category.value.id}/attempts`;
  
  AttemptService.StartQuestion(url).then((res: AxiosResponse<{ questions: ICategoryAttempData[] }>) => {
    attempt.value = res.data.questions.map(item => ({ ...item, canChange: true }));
    foundLastQuestion();
  });
};

const setChoice = () => {
  if (!activeQuestion.value) return;

  const result: IPostAttemp = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;
  AttemptService.SaveQuestion(`/${category.value.id}/attempts/${activeQuestion.value.attemptId}`, result)
    .then(res => {
      selected.value = null;
      activeQuestion.value.isCorrect = res.data.isCorrect;
      activeQuestion.value.correctChoiceId = res.data.correctChoiceId;
    })
    .catch(e => notify({ text: e.response.data.message, type: "error" }))
    .finally(() => (saveLoading.value = false));
};

const nextAttemp = () => {
  if (activeQuestion.value?.choiceId) activeQuestionIndex.value++;
};

const foundLastQuestion = () => {
  const lastAnswer = attempt.value.find(item => !item.choiceId);
  if (lastAnswer) activeQuestionIndex.value = attempt.value.indexOf(lastAnswer);
};

const handleAnswerClick = (answerId: number) => {
  if (activeQuestion.value?.canChange) {
    activeQuestion.value.choiceId = answerId;
    activeQuestion.value.canChange = false;
    setChoice();
  }
};

fetchAttemp();
</script>

<template>
  <v-card class="bg-background" elevation="0">
    <v-card-text class="bg-light mx-4">
      <v-card-title v-if="activeQuestion" class="rounded-lg">
        <h3 class="text-start question-text">{{ activeQuestionIndex + 1 }}. {{ activeQuestion.question.questionText }}</h3>
      </v-card-title>
      
      <v-card elevation="0">
        <v-card-text v-if="attempt.length">
          <v-row class="mb-2">
            <v-col lg="6" cols="12">
              <AnswerCard v-for="(answer, index) in activeQuestion.question.choices" :key="answer.id"
                :item="answer" :question="activeQuestion" :index="index"
                @click="handleAnswerClick(answer.id)" :active="activeQuestion.choiceId == answer.id" />
              
              <div class="showHiddenBtn mb-2" @click="isDescriptionVisible = !isDescriptionVisible">
                {{ isDescriptionVisible ? "Berkitish" : "Izohni ko'rish" }}
              </div>
              
              <span v-if="isDescriptionVisible && activeQuestion.question?.description"
                class="text-warning d-flex align-center justify-center text-13 quiz-description">
                <img src="../../assets/images/warning.svg" alt="" style="width: 30px; margin-top:5px" />
                <span>{{ activeQuestion.question.description }}</span>
              </span>
            </v-col>
            
            <v-col md="6" sm="12" cols="12" class="d-flex justify-center">
              <img :src="activeQuestion?.question?.fileId ? `https://api.uatest.uz/api/Files?fileName=${activeQuestion.question.fileId}` : defaultImage"
                class="responsive-image" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="d-flex justify-space-between">
  <v-btn variant="flat" color="error" @click="emits('update:modelValue', false)">
    {{ $t("back") }}
  </v-btn>
  <v-btn
    variant="flat"
    color="success"
    @click="nextAttemp()"
    v-if="activeQuestionIndex !== attempt.length - 1"
  >
    {{ $t("nextQuestion") }}
  </v-btn>
</v-card-actions>
      </v-card>

      <v-slide-group show-arrows v-if="attempt.length">
        <v-slide-group-item v-for="(n, i) in category.questionsCount" :key="i">
          <div class="d-flex align-center">
            <div class="btn-outline" @click="activeQuestionIndex = i"
              :class="{ 'active': i === activeQuestionIndex, 'success': attempt[i]?.isCorrect, 'error': attempt[i]?.choiceId && !attempt[i]?.isCorrect }">
              <button class="btn"><span>{{ n }}</span></button>
            </div>
            <div class="divider" v-if="i !== category.questionsCount - 1"></div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-text>
  </v-card>
</template>


<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,900&display=swap');

.responsive-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.btn-outline {
  border: 0.0625rem solid;
  border-radius: 50%;
  flex: 0 0 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: #0e449b;
    color: white;
  }

  &.success {
    background: #4caf50;
    color: white;
  }

  &.error {
    background: #f44336;
    color: white;
  }
}

.divider {
  flex: 0 0 1.125rem;
  width: 1.125rem;
  height: 2px;
  background: #2196f3;
}

.question-text {
  font-size: 1.75rem;
  font-weight: 700;
  color: rgb(var(--v-theme-text));
  white-space: pre-wrap;
  line-height: 1.2 !important;
}

.quiz-description {
  white-space: pre-wrap;
  background: rgba(247, 182, 19, 0.1);
  color: #dea303;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 14px;
}

.btn {
  flex: 0 0 2rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>
