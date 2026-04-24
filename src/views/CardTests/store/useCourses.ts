import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { CoursesService } from "@/services/services/Courses.service";

interface IFilter {
  page: number;
  size: number;
  total: number;
  search: string;
}

export const useCourses = defineStore("courses", {
  state: () => ({
    courses: [] as any[],
    coursesLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
      search: "",
    } as IFilter,
  }),
  actions: {
    buildQuery(): string {
      const parts = [`Page=${this.filter.page}`, `Size=${this.filter.size}`];
      if (this.filter.search) parts.push(`Search=${encodeURIComponent(this.filter.search)}`);
      return parts.join("&");
    },
    load() {
      this.coursesLoading = true;
      CoursesService.GetCourses(this.buildQuery())
        .then((res) => {
          this.courses = res.data.data;
          this.filter.total = res.data.totalCount;
        })
        .catch((e) => setError(e))
        .finally(() => (this.coursesLoading = false));
    },
    fetchCourses() {
      if (this.courses.length) return;
      this.load();
    },
    refresh() {
      this.load();
    },
  },
});
