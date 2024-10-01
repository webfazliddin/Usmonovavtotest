import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { CategoriesService } from "@/services/services/Categories";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useCategories = defineStore("categories", {
  state: () => ({
    categories: [] as any[],
    categoriesLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
    } as IFilter,
  }),
  actions: {
    fetchCategories() {
      this.categoriesLoading = true;
      CategoriesService.GetCategories(
        `Page=${this.filter.page}&Size=${this.filter.size}`
      )
        .then((res) => {
          this.categories = res.data.data
          this.filter.total = res.data.total;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.categoriesLoading = false;
        });
    },
  },
});
