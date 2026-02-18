import { RouteRecordRaw } from "vue-router";

export const ExamRoutes: RouteRecordRaw[] = [
  {
    path: "/exam",
    name: "Exam",
    component: () => import("./index.vue"),
  },
];

export const ExamFullscreenRoutes: RouteRecordRaw[] = [
  {
    path: "/exam-test",
    name: "ExamTest",
    meta: { requiresAuth: true },
    component: () => import("./ExamTestPage.vue"),
  },
];
