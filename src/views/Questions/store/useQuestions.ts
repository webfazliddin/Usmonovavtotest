import { ISelectList } from "@/models/basic";
import { CategoriesService } from "@/services/services/Categories";
import { QuestionsService } from "@/services/services/Questions";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";

interface IFilter {
  page: number;
  size: number;
  total: number;
  Search: string;
  CategoryId: number | null;
}

export const useQuestions = defineStore("questions", {
  state: () => ({
    questions: [] as any[],
    questionsLoading: false as boolean,
    categories: [] as ISelectList[],
    filter: {
      page: 1,
      size: 20,
      total: 0,
      Search: "",
      CategoryId: null,
    } as IFilter,
  }),
  actions: {
    fetchQuestions() {
      this.questionsLoading = true;
      QuestionsService.GetQuestions(
        `Page=${this.filter.page}&Size=${this.filter.size}&Search=${
          this.filter.Search
        }&CategoryId=${this.filter.CategoryId ?? ""}`
      )
        .then((res) => {
          this.questions = res.data.data;
          this.filter.total = res.data.totalCount;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.questionsLoading = false;
        });
    },
    fetchCategories() {
      CategoriesService.SelectList().then((res) => {
        this.categories = res.data;
      });
    },
  },
});
