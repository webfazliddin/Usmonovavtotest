import { RouteRecordRaw } from "vue-router";

export const MyExamResultsRoutes: RouteRecordRaw[] = [
  {
    path: "/my-exam-result",
    name: "MyExamResult",
    component: () => import("./index.vue"),
  },
];
