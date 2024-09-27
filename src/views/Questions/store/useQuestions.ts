import { QuestionsService } from "@/services/services/Questions";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";

export const useQuestions = defineStore("questions", {
  state: () => ({
    questions: [] as any[],
    questionsLoading: false as boolean,
    questionDetailLoading: false as boolean,
    questionDetail: null as any,
    page: 1 as number,
    size: 20 as number,
    total: 0 as number,
  }),
  actions: {
    fetchQuestions() {
      this.questionsLoading = true;
      QuestionsService.GetQuestions(`Page=${this.page}&Size=${this.size}`)
        .then((res) => {
          this.questions = res.data.data;
          this.total = res.data.total;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.questionsLoading = false;
        });
    },
    PaginateQuestions() {
      QuestionsService.GetQuestions(`Page=${this.page}&Size=${this.size}`)
        .then((res) => {
          this.questions.push(...res.data.data);
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.questionsLoading = false;
        });
    },
    fetchQuestionById(id: number | string) {
      this.questionDetailLoading = true;
      QuestionsService.GetById(id)
        .then((res) => {
          this.questionDetail = res.data;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.questionDetailLoading = false;
        });
    },
  },
});
