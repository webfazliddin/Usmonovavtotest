<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import { ICategoryAttempData, IPostAttemp, MyCategories } from "./types";
import { AttemptService } from "@/services/services/Attempts.service";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { AxiosResponse } from "axios";
import { FilesService } from "@/services/services/Files.service";
import {
  FileDescriptionIcon,
} from "vue-tabler-icons";

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
const questionPhoto = ref<string | null>(null);

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
      getPhoto();
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
  if (attempt.value[index].choiceId) {
  }
};

const getPhoto = () => {
  if (!activeQuestion.value.question.fileId) {
    questionPhoto.value = null;
    return;
  }
  FilesService.GetFiles(`${activeQuestion.value.question.fileId}`).then(
    (res) => {
      questionPhoto.value = `data:image/png;base64,${res.data.file}`;
    }
  );
};

watch(
  () => activeQuestionIndex.value,
  () => {
    getPhoto();
  }
);

fetchAttemp();
</script>

<template>
  <v-card class="bg-background" elevation="0">
    <!-- <v-card-title class="pa-0 mx-4">
      <v-toolbar color="info" class="px-8 mt-4  bg-gradient rounded-lg">
        <div class="test-header">
          <div class="left-collar">
           
            <div class="img">
              <FileDescriptionIcon color="black" />
            </div>
            <h4>{{ category.name }}</h4>
          </div>
          <div></div>
          <div class="d-flex align-center mt-1">
            <div class="logo-img"><img src="../../assets/images/main-logo.png" alt=""></div>
            <div class="logo-title">USMONOV AVTO TEST</div>
          </div>
        </div>
      </v-toolbar>
    </v-card-title> -->

    <v-card-text class="bg-light mx-4">
      <div style="display: flex; justify-content: space-between;">
        <div>
          <v-card-title class="rounded-lg d-flex" v-if="activeQuestion && attempt.length">
            <h3 class="text-start question-text">
              {{ activeQuestionIndex + 1 }}.
              {{ activeQuestion.question.questionText }}
            </h3>
          </v-card-title>
        </div>

        <div>
          <v-btn variant="flat" color="error" @click="emits('update:modelValue', false)">
            {{ $t("back") }}
          </v-btn>
        </div>
      </div>


      <v-card elevation="0" l>


        <v-card-text v-if="attempt.length && activeQuestion">
          <v-row class="">
            <v-col lg="4" cols="12" class="py-0 my-3">
              <AnswerCard v-for="(answer, index) in activeQuestion.question.choices" :key="answer.id" :item="answer"
                :question="activeQuestion" :active-question="activeQuestion" :index="index"
                @click="handleAnswerClick(answer.id)" :active="activeQuestion.choiceId == answer.id">
              </AnswerCard>

              <v-card-actions>
                <v-btn variant="flat" color="success" class="w-100" @click="nextAttemp()"
                  v-if="activeQuestionIndex !== attempt.length - 1 && activeQuestion">
                  {{ $t("nextQuestion") }}
                </v-btn>
              </v-card-actions>

              <span v-if="activeQuestion.question?.description"
                class="d-block mt-4 text-warning d-flex align-center justify-center text-13 quiz-description">
                <span><img src="../../assets/images/warning.svg" alt="" /></span>
                <span> {{ activeQuestion.question.description }}</span>
              </span>

            </v-col>

            <v-col lg="4" cols="12">
              <img :src="questionPhoto" v-if="questionPhoto" class="mx-auto my-3" height="500px" width="200%" />
              <img v-else style="background-size:auto;" class="mx-auto my-3 d-block logoimg" height="500px" width="200%"
                src="../../assets/images/car.jpg" />
            </v-col>
          </v-row>

        </v-card-text>

        <v-slide-group show-arrows v-if="attempt.length">
          <v-slide-group-item v-for="(n, i) in category.questionsCount" icon>
            <div class="d-flex align-center">
              <div class="btn-outline" @click="setActiveQuestionIndex(i)" :class="[
                {
                  active: i == activeQuestionIndex,
                  less: i < activeQuestionIndex,
                  success: attempt[i].choiceId,
                  error: attempt[i].choiceId && !attempt[i].isCorrect,
                },
              ]">
                <button class="btn">
                  <span>{{ n }}</span>
                </button>
              </div>
              <div class="divider" v-if="n != attempt.length"></div>
            </div>
          </v-slide-group-item>
        </v-slide-group>


      </v-card>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
// .bg-background {
//   background: #2a2b2e !important;
// }
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
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-text));
  white-space: pre-wrap;
  line-height: 1.2 !important;
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

.logo-title {
  font-size: 30px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

// .logo-img img {
//   height: 50px;
// }
.logoimg img {
  border: 1px solid black;
}
</style>
<style>
.v-card-actions {
  padding: 0 !important;
  height: 50px !important;
}

.v-btn {
  height: 50px !important;
}
</style>