import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { MarkCategoryService } from "@/services/services/MarkCategory";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useMarkCategory = defineStore("MarkCategories", {
  state: () => ({
    MarkCategories: [] as any[],
    MarkCategoriesLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
    } as IFilter,
  }),
  actions: {
    fetchMarkCategories() {
      if (this.MarkCategories.length) return;
      this.MarkCategoriesLoading = true;
      MarkCategoryService.GetMarkCategory(
        `Page=${this.filter.page}&Size=${this.filter.size}`
      )
        .then((res) => {
          this.MarkCategories = res.data.data;

          this.filter.total = res.data.totalCount;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.MarkCategoriesLoading = false;
        });
    },
  },
});
