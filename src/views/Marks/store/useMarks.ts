import { ISelectList } from "@/models/basic";
import { MarksService } from "@/services/services/Marks";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useMarks = defineStore("marks", {
  state: () => ({
    marks: [] as any[],
    marksLoading: false as boolean,
    categories: [] as ISelectList[],
    filter: {
      page: 1,
      size: 20,
      total: 0,
    } as IFilter,
  }),
  actions: {
    fetchMarks() {
      this.marksLoading = true;
      MarksService.GetMarks(
        `Page=${this.filter.page}&Size=${this.filter.size}`
      )
        .then((res) => {
          this.marks = res.data.data;
          this.filter.total = res.data.totalCount;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.marksLoading = false;
        });
    },

  },
});
