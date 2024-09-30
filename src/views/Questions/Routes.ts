import { RouteRecordRaw } from "vue-router";

export const QuestionRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/questions",
    name: "Questions",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/questions/edit/:id",
    name: "EditQuestion",
    component: () => import("./edit.vue"),
  },
];
