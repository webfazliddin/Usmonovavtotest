import { defineStore } from "pinia";

interface IState {
  isAdmin: boolean;
}

export const useUserStore = defineStore({
  id: "userData",
  state: (): IState => ({
    isAdmin: localStorage.getItem("isAdmin")
      ? JSON.parse(localStorage.getItem("isAdmin")!)
      : false,
  }),
  getters: {
    getIsAdmin(): boolean {
      return this.isAdmin;
    },
  },
  actions: {
    setIsAdmin(payload: boolean) {
      this.isAdmin = payload;
    },
  },
});
