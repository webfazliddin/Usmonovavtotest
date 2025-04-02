<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue";
import { ICategoryAttempData, IPostAttemp } from "./types";
import AnswerCard from "./AnswerCard.vue";
import { notify } from "@kyvg/vue3-notification";
import { useFormatter } from "@/utils/formatter";
import defaultImage from "@/assets/images/car.jpg";
import { CardService } from "@/services/services/Cards.service";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/app/config/layouts/store/user";

interface IProps {
  modelValue?: boolean;
  view?: boolean;
}
const props = defineProps<IProps>();
const { view } = toRefs(props);

const emits = defineEmits(["update:modelValue", "showResult"]);
const { secondsToHms } = useFormatter();

const userStore = useUserStore();

const attempt = ref<ICategoryAttempData[]>([]);

const route = useRoute();
const router = useRouter();

const timer_interval = ref<number | undefined>();
const timer = ref(1200);
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

const fetchAttemp = async () => {
  const { data } = await CardService.GetCard(+route.params.cardId);
  attempt.value = data;
};

const nextAttemp = () => {
  if (userStore.isAdmin) return;

  if (view.value) {
    activeQuestionIndex.value = activeQuestionIndex.value + 1;
    return;
  }

  if (activeQuestion.value && !activeQuestion.value.choiceId) return;

  const result: IPostAttemp = {
    questionId: activeQuestion.value.question.id,
    choiceId: activeQuestion.value.choiceId,
  };

  saveLoading.value = true;

  CardService.GetAttemp(`${activeQuestion.value.attemptId}`, result)
    .then((res) => {
      selected.value = null;

      attempt.value.forEach((item) => {
        item.question.choices.forEach((choice) => {
          if (choice.id === res.data.choiceId) {
            item.choiceId = res.data.choiceId;
            item.isCorrect = res.data.isCorrect;
          }
        });
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

      if (activeQuestionIndex.value !== attempt.value.length - 1) {
        activeQuestionIndex.value = activeQuestionIndex.value + 1;
      } else {
        emits("showResult", activeQuestion.value.attemptId);
        emits("update:modelValue", false);
      }
    });
};

const handleAnswerClick = (answerId: number) => {
  if (view.value) return;
  activeQuestion.value.choiceId = answerId;
};

const setActiveQuestionIndex = (index: number) => {
  if (attempt.value[index].choiceId) {
    activeQuestionIndex.value = index;
  }
};

const handleKeyDownClick = (event: KeyboardEvent) => {
  // TEST jarayonida 50 ta savolni to'risi mishkani uyodan buyoga ob kelish qiyin narsa, kere bo'masa prosta pastdegi 3 ta qatorni komment ob qo'yasiz
  if (event.key == "Enter") {
    nextAttemp();
  }
};

refreshTimer();
fetchAttemp();

onMounted(() => {
  window.addEventListener("keydown", handleKeyDownClick);
});
</script>

<template>
  <v-card class="bg-background" elevation="0">
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
      <v-card elevation="0" class="mt-4" v-if="activeQuestion">
        <v-card-title class="rounded-lg">
          <h3 class="text-center question-text">
            {{ activeQuestionIndex + 1 }}.
            {{ activeQuestion.question.questionText }}
          </h3>
        </v-card-title>

        <v-card-text class="mt-8">
          <template v-for="(att, attIndex) in attempt">
            <v-row
              v-if="attIndex == activeQuestionIndex"
              class="d-flex align-center"
            >
              <!-- Answer choices on the left -->
              <v-col md="6" sm="12" cols="12" class="py-0 my-1">
                <v-row>
                  <v-col
                    cols="12"
                    v-for="(answer, index) in att.question.choices"
                    :key="answer.id"
                  >
                    <AnswerCard
                      :item="answer"
                      :question="att"
                      :active-question="activeQuestion"
                      :index="index"
                      @click="handleAnswerClick(answer.id)"
                      :active="activeQuestion.choiceId == answer.id"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <!-- Image on the right -->
              <v-col md="6" sm="12" cols="12" class="d-flex justify-center">
                <img
                  :src="
                    activeQuestion?.question?.fileId
                      ? `https://api.uatest.uz/api/Files?fileName=${activeQuestion.question.fileId}`
                      : defaultImage
                  "
                  class="responsive-image"
                />
              </v-col>
            </v-row>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-btn variant="flat" color="error" @click="router.back()">
            {{ $t("back") }}
          </v-btn>
          <v-spacer />
          <template v-if="!userStore.isAdmin">
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
          </template>
        </v-card-actions>
      </v-card>

      <v-slide-group show-arrows>
        <v-slide-group-item v-for="(n, i) in attempt" :key="i">
          <div class="d-flex align-center">
            <div
              class="btn-outline"
              @click="setActiveQuestionIndex(i)"
              :class="{
                active: i == activeQuestionIndex,
                less: i < activeQuestionIndex,
                success: n.choiceId,
                error: n.choiceId && !n.isCorrect,
              }"
            >
              <button class="btn">
                <span>{{ i + 1 }}</span>
              </button>
            </div>
            <div class="divider" v-if="i + 1 != attempt.length"></div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.responsive-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
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
      width: 4.5625rem;
      height: 3.5625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      img {
        width: 4.5625rem;
        height: 4.5625rem;
      }

      // background-color: rgb(var(--v-theme-background));
    }
  }
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
