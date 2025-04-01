import { TrafficMarksService } from "@/services/services/TrafficMarks.service";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useTrafficMarks = defineStore("traffic-marks", {
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
      TrafficMarksService.GetTrafficMarks(
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
