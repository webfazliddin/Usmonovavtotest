import { RouteRecordRaw } from "vue-router";

export const ExamRoutes: RouteRecordRaw[] = [
  {
    path: "/exam",
    name: "Exam",
    component: () => import("./index.vue"),
  },
];
