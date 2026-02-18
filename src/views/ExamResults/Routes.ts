import { RouteRecordRaw } from "vue-router";

export const ExamResultsRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/exam-results",
    name: "ExamResults",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/exam-results/:userId",
    name: "ExamResultDetails",
    component: () => import("./details.vue"),
  },
];
