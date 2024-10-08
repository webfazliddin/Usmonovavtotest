import { defineStore } from "pinia";
import { ConfigProps } from "./config";

export const useCustomizing = defineStore("customizer", {
  state: (): ConfigProps => ({
    sidebar_drawer: null,
    mini_sidebar: false,
  }),
  actions: {
    SET_SIDE_BAR() {
      this.sidebar_drawer = !this.sidebar_drawer;
    },
    SET_MINI_SIDE_BAR() {
      this.mini_sidebar = !this.mini_sidebar;
    },
  },
});
