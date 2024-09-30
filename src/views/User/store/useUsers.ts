import { QuestionsService } from "@/services/services/Questions";
import { UsersService } from "@/services/services/Users.service";
import { setError } from "@/utils/helpers";
import { defineStore } from "pinia";
import { UserModel } from "../types";

export const useUsers = defineStore("users", {
  state: () => ({
    users: [] as UserModel[],
    usersLoading: false as boolean,
    page: 1 as number,
    size: 20 as number,
    total: 0 as number,
  }),
  actions: {
    fetchQuestions() {
      this.usersLoading = true;
      UsersService.GetUsers(`Page=${this.page}&Size=${this.size}`)
        .then((res) => {
          this.users = res.data.data;
          this.total = res.data.total;
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          this.usersLoading = false;
        });
    },
    PaginateQuestions() {
      QuestionsService.GetQuestions(`Page=${this.page}&Size=${this.size}`)
        .then((res) => {
          this.users.push(...res.data.data);
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
