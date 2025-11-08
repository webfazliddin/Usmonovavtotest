import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { CardTestsService } from "@/services/services/CardTests.service";

interface IFilter {
  page: number;
  size: number;
  total: number;
  search: "";
}

export const useCardTests = defineStore("card-tests", {
  state: () => ({
    data: [] as any[],
    dataLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
      search: "",
    } as IFilter,
  }),
  actions: {
    fetchData() {
      if (this.data.length) return;

      this.dataLoading = true;
      const searchParam = this.filter.search ? `&Search=${this.filter.search}` : '';
      CardTestsService.GetCardTests(
        `Page=${this.filter.page}&Size=${this.filter.size}${searchParam}`
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
    refreshData() {
      this.dataLoading = true;
      const searchParam = this.filter.search ? `&Search=${this.filter.search}` : '';
      CardTestsService.GetCardTests(
        `Page=${this.filter.page}&Size=${this.filter.size}${searchParam}`
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
