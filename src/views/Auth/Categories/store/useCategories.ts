import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { CategoriesService } from "@/services/services/Categories";

interface IFilter {
  page: number;
  size: number;
  total: number;
}

export const useUsers = defineStore("users", {
  state: () => ({
    users: [] as any[],
    usersLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0,
    } as IFilter,
  }),
  actions: {
    fetchUsers() {
      this.usersLoading = true;
      CategoriesService.GetCategories(
        `Page=${this.filter.page}&Size=${this.filter.size}`
      )
        .then((res) => {
          this.users = res.data.data;
          this.filter.total = res.data.total;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.usersLoading = false;
        });
    },
  },
});
