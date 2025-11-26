import { RouteRecordRaw } from "vue-router";

export const ExamResultsRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/exam-results",
    name: "ExamResults",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/exam-results/:attemptId",
    name: "ExamResultDetails",
    component: () => import("./details.vue"),
  },
];
