<script setup lang="ts">
import { computed, ref } from "vue";
import { ICategoryAttempData, IPostAttemp } from "./types";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { useFormatter } from "@/utils/formatter";
import { ExamService } from "@/services/services/Exams.service";

interface IProps {
  modelValue: boolean;
}
defineProps<IProps>();

const emits = defineEmits(["update:modelValue"]);
const { secondsToHms } = useFormatter();

const attempt = ref<ICategoryAttempData[]>([]);

const timer_interval = ref<number | undefined>();
const timer = ref(60);
const activeQuestionIndex = ref(0);
const saveLoading = ref(false);
const activeQuestion = computed(
  () => attempt.value && attempt.value[activeQuestionIndex.value]
);
const selected = ref<number | null>(null);

const clearTimer = () => clearInterval(timer_interval.value);

const refreshTimer = () => {
  clearTimer();

  timer_interval.value = setInterval(() => {
    if (timer.value === 0) {
      clearTimer();
      return;
    }

    timer.value--;
  }, 1000);
};

const fetchAttemp = () => {
  ExamService.Exmas().then((res) => {
    attempt.value = res.data;
  });
};

const nextAttemp = () => {
  if (activeQuestion.value && !activeQuestion.value.choiceId) return;

  const result: IPostAttemp = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;

  ExamService.PostExmas(`/${activeQuestion.value.attemptId}`, result)
    .then((res) => {
      selected.value = null;

      attempt.value.forEach((item) => {
        if (item.question.id === res.data.question.id) {
          item.choiceId = res.data.choiceId;
          item.isCorrect = res.data.isCorrect;
        }
      });
    })
    .catch((e) => {
      notify({
        text: e.response.data.message,
        type: "error",
      });
    })
    .finally(() => {
      saveLoading.value = false;

      if (activeQuestionIndex.value < attempt.value.length) {
        activeQuestionIndex.value = activeQuestionIndex.value + 1;
      }
    });
};

const handleAnswerClick = (answerId: number) => {
  activeQuestion.value.choiceId = answerId;
};

const setActiveQuestionIndex = (index: number) => {
  if (attempt.value[index].choiceId) {
    activeQuestionIndex.value = index;
  }
};

// refreshTimer();
fetchAttemp();
</script>

<template>
  <v-card class="bg-background">
    <v-card-title class="pa-0 mx-4">
      <v-toolbar color="info" class="px-8 mt-4 py-4 bg-gradient rounded-lg">
        <div class="test-header">
          <div class="left-collar">
            <div class="img">
              <img src="@/assets/images/testIcon.png" alt="" />
            </div>
            <h5>{{ $t("finalTest") }}</h5>
          </div>

          <div class="right-collar">
            <div class="icon">
              <img src="@/assets/images/testTimer.png" alt="" />
            </div>
            {{ secondsToHms(timer) }}
          </div>
        </div>
      </v-toolbar>
    </v-card-title>
    <v-card-text class="bg-light mx-4" v-if="attempt.length">
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="(n, i) in attempt.length" icon>
          <div class="d-flex align-center">
            <div
              class="btn-outline"
              @click="setActiveQuestionIndex(i)"
              :class="[
                {
                  active: i == activeQuestionIndex,
                  less: i < activeQuestionIndex,
                  success: attempt[i].choiceId,
                  error: attempt[i].choiceId && !attempt[i].isCorrect,
                },
              ]"
            >
              <button class="btn">
                <span>{{ n }}</span>
              </button>
            </div>
            <div class="divider" v-if="n != attempt.length"></div>
          </div>
        </v-slide-group-item>
      </v-slide-group>

      <v-card elevation="0" class="mt-4" v-if="activeQuestion">
        <v-card-title class="rounded-lg">
          <h3 class="text-center">
            {{ activeQuestionIndex + 1 }}.
            {{ activeQuestion.question.questionText }}
          </h3>
        </v-card-title>

        <v-card-text class="mt-8">
          <v-row>
            <v-col
              v-for="(answer, index) in activeQuestion.question.choices"
              cols="12"
              class="py-0 my-1"
            >
              <AnswerCard
                :key="answer.id"
                :item="answer"
                :active-question="activeQuestion"
                :index="index"
                @click="handleAnswerClick(answer.id)"
                :active="activeQuestion.choiceId == answer.id"
              >
              </AnswerCard>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            variant="flat"
            color="error"
            @click="emits('update:modelValue', false)"
          >
            {{ $t("back") }}
          </v-btn>
          <v-spacer />
          <v-btn
            variant="flat"
            color="success"
            @click="nextAttemp()"
            v-if="activeQuestionIndex !== attempt.length"
          >
            {{
              activeQuestionIndex === attempt.length - 1
                ? $t("finishQuestion")
                : $t("nextQuestion")
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(91.88deg, #0e449b 0%, #4284eb 100%);
}
.bg-light {
  border-radius: 10px;
  margin-top: 26px;
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
