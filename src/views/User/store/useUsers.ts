import { UsersService } from "@/services/services/Users.service";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { UserModel } from "../types";

interface IFilter {
  
  page: number,
  size: number,
  total: number
}


export const useUsers = defineStore("users", {
  state: () => ({
    users: [] as UserModel[],
    usersLoading: false as boolean,
    filter: {
      page: 1,
      size: 20,
      total: 0
    } as IFilter
  }),
  actions: {
    fetchUsers() {
      this.usersLoading = true;
      UsersService.GetUsers(`Page=${this.filter.page}&Size=${this.filter.size}`)
        .then((res) => {
          this.users = res.data.data;
          this.filter.total = res.data.totalCount;
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
