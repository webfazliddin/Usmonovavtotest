import { RouteRecordRaw } from "vue-router";

export const QuestionRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/",
    name: "Marks",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/mark-data/edit/:id",
    name: "EditMarks",
    component: () => import("./edit.vue"),
  },
];
