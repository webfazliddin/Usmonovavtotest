<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { ICategoryAttempData, IPostAttemp, MyCategories } from "./types";
import { AttemptService } from "@/services/services/Attempts.service";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";

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
const activeQuestion = computed(
  () => attempt.value && attempt.value[activeQuestionIndex.value]
);
const selected = ref<number | null>(null);

const isDescriptionVisible = ref(false); // New reactive variable to control description visibility

const fetchAttemp = () => {
  if (view.value) {
    return;
  }
  if (category.value && category.value.attemptId && continueTest.value) {
    AttemptService.StartQuestion(
      `/${category.value.id}/attempts/${category.value.attemptId}`
    ).then(
      (
        res: AxiosResponse<{
          questions: Array<ICategoryAttempData>;
        }>
      ) => {
        attempt.value = res.data.questions.map((item: ICategoryAttempData) => {
          return {
            ...item,
            canChange: true,
          };
        });
        foundLastQuestion();
      }
    );

    return;
  }
  AttemptService.StartQuestion(`/${category.value.id}/attempts`).then(
    (
      res: AxiosResponse<{
        questions: Array<ICategoryAttempData>;
      }>
    ) => {
      attempt.value = res.data.questions.map((item: ICategoryAttempData) => {
        return {
          ...item,
          canChange: true,
        };
      });
    }
  );
};

const setChoice = () => {
  const result: IPostAttemp = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;

  AttemptService.SaveQuestion(
    `/${category.value.id}/attempts/${activeQuestion.value.attemptId}`,
    result
  )
    .then((res) => {
      selected.value = null;
      activeQuestion.value.isCorrect = res.data.isCorrect;
      activeQuestion.value.correctChoiceId = res.data.correctChoiceId;
    })
    .catch((e) => {
      notify({
        text: e.response.data.message,
        type: "error",
      });
    })
    .finally(() => {
      saveLoading.value = false;
    });
};

const nextAttemp = () => {
  if (activeQuestion.value && !activeQuestion.value.choiceId) return;

  activeQuestionIndex.value = activeQuestionIndex.value + 1;
};

const foundLastQuestion = () => {
  if (attempt.value) {
    const lastAnswer = attempt.value.find((item) => !item.choiceId);

    if (!lastAnswer) {
      return;
    }
    activeQuestionIndex.value = attempt.value.indexOf(lastAnswer);
  }
};

const handleAnswerClick = (answerId: number) => {
  if (!activeQuestion.value.canChange) {
    return;
  }

  activeQuestion.value.choiceId = answerId;
  activeQuestion.value.canChange = false;

  setChoice();
};

const setActiveQuestionIndex = (index: number) => {
  activeQuestionIndex.value = index;
};

fetchAttemp();
</script>

<template>
  <v-card class="bg-background" elevation="0">
    <v-card-text class="bg-light mx-4">
      <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <div>
          <v-card-title class="rounded-lg" v-if="activeQuestion && attempt.length">
            <h3 class="text-start question-text">
              {{ activeQuestionIndex + 1 }}.
              {{ activeQuestion.question.questionText }}
            </h3>
          </v-card-title>
        </div>
        <div class="dNone">
          <v-btn variant="flat" color="error" @click="emits('update:modelValue', false)">
            {{ $t("back") }}
          </v-btn>
        </div>
      </div>
      <v-card elevation="0">
        <v-card-text v-if="attempt.length && activeQuestion">
          <v-row class="mb-2">
            <v-col lg="6" cols="12">
              <AnswerCard v-for="(answer, index) in activeQuestion.question.choices" :key="answer.id" :item="answer"
                :question="activeQuestion" :active-question="activeQuestion" :index="index"
                @click="handleAnswerClick(answer.id)" :active="activeQuestion.choiceId == answer.id" />
              <v-card-actions>
                <v-btn variant="flat" color="success" class="w-100" @click="nextAttemp()" v-if="
                  activeQuestionIndex !== attempt.length - 1 && activeQuestion
                ">
                  {{ $t("nextQuestion") }}
                </v-btn>
              </v-card-actions>
              <div class="showHiddenBtn mb-2" @click="isDescriptionVisible = !isDescriptionVisible">
                {{ isDescriptionVisible ? "Berkitish" : "Izohni ko'rish" }}
              </div>
              <span v-if="
                isDescriptionVisible && activeQuestion.question?.description
              " class=" text-warning d-flex align-center justify-center text-13 quiz-description">
                <span><img style="width: 30px; margin-top:5px" src="../../assets/images/warning.svg" alt="" /></span>
                <span> {{ activeQuestion.question.description }}</span>
              </span>
            </v-col>
            <v-col lg="6" cols="12">
              <img :src="`https://api.uatest.uz/api/Files?fileName=${activeQuestion.question.fileId}`"
                v-if="activeQuestion?.question?.fileId" class="image1" />
              <img v-else src="../../assets/images/car.jpg" class="image2" />
            </v-col>
          </v-row>
          <v-slide-group show-arrows v-if="attempt.length">
        <v-slide-group-item v-for="(n, i) in category.questionsCount" :key="i">
          <div class="d-flex align-center">
            <div class="btn-outline" @click="setActiveQuestionIndex(i)" :class="{
              'active': i === activeQuestionIndex,
              'success': attempt[i]?.isCorrect,
              'error': attempt[i]?.choiceId && !attempt[i]?.isCorrect
            }">
              <button class="btn">
                <span>{{ n }}</span>
              </button>
            </div>
            <div class="divider" v-if="i !== category.questionsCount - 1"></div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
        </v-card-text>
      
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Red+Hat+Text:ital,wght@0,300..700;1,300..700&display=swap');

.bg-gradient {
  background: linear-gradient(91.88deg, #0e449b 0%, #4284eb 100%);
}

.bg-light {
  border-radius: 10px;
  margin-top: 6px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .left-collar {
    display: flex;
    align-items: center;
    gap: 10px;

    .img {
      width: 40px;
      height: 40px;
      background-color: rgb(var(--v-theme-background));
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;

      img {
        width: 27px;
        height: 27px;
      }
    }
  }

  .right-collar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .icon {
      width: 2.5625rem;
      height: 2.5625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      img {
        width: 1.5625rem;
        height: 1.5625rem;
      }

      background-color: rgb(var(--v-theme-background));
    }
  }
}

// .image1 {
//   height: 600px;
//   width: 100%;
//   border-radius: 7px;
// }

// .image2 {
//   height: 600px;
//   border-radius: 7px;
//   width: 100%;
//   background-size: auto;
// }
.image1,
.image2 {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  border-radius: 7px;
}

@media (max-width: 1024px) {
  .image1,
  .image2 {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .image1,
  .image2 {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .image1,
  .image2 {
    max-height: 200px;
  }
}

.btn-outline {
  border: 0.0625rem solid;
  border-radius: 50%;
  flex: 0 0 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-light));
  }

  &.less {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-light));
  }

  &.success {
    background: rgb(var(--v-theme-success));
    color: rgb(var(--v-theme-light));
  }

  &.error {
    background: rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-light));
  }
}

.divider {
  flex: 0 0 1.125rem;
  width: 1.125rem;
  height: 2px;
  background: rgb(var(--v-theme-info));
}

.question-text {
  border: 1px solid rgb(235, 235, 235);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px 10px;
  border-radius: 7px;
  font-size: 20px;
  font-weight: 500;
  color: rgb(var(--v-theme-text));
  white-space: pre-wrap;
  line-height: 1.2 !important;
  font-family: "Red Hat Text", sans-serif;
}

.quiz-description {
  white-space: pre-wrap;
  background: rgba(247, 182, 19, 0.105);
  color: #dea303 !important;
  padding: 1rem;
  border-radius: 8px;
  gap: 10px;
  font-weight: 500;
  font-size: 15px;
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

.showHiddenBtn {
  border: 1px solid rgb(235, 235, 235);
  width: 100px;
  text-align: center;
  cursor: pointer;
  background: rgb(153, 153, 153);
  color: white;
}
</style>
