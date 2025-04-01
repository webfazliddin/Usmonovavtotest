import { MarkCategoriesService } from "@/services/services/MarkCategories.service";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useMarkCategories = defineStore("mark-categories", {
  state: () => ({
    data: [] as any[],
    dataLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
    } as IFilter,
  }),
  actions: {
    fetchData() {
      this.dataLoading = true;
      MarkCategoriesService.GetMarkCategories(
        `Page=${this.filter.page}&Size=${this.filter.size}`
      )
        .then((res) => {
          this.data = res.data.data;
          this.filter.total = res.data.totalCount;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.dataLoading = false;
        });
    },
  },
});
