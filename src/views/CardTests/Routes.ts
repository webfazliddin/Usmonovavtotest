import { RouteRecordRaw } from "vue-router";

export const CardTestsRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/card-tests",
    name: "CardTests",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/card-tests/edit/:id",
    name: "EditCardTests",
    component: () => import("./edit.vue"),
  },
  {
    path: "/admin/card-tests/:courseId/lessons/edit/:lessonId",
    name: "EditLesson",
    component: () => import("./LessonEdit.vue"),
  },
  {
    path: "/admin/card-tests/:courseId/tests/edit/:testId",
    name: "EditCourseTest",
    component: () => import("./TestEdit.vue"),
  },
];

// Fullscreen (standalone) — sidebar va header yopiladi
export const CardTestsFullscreenRoutes: RouteRecordRaw[] = [
  {
    path: "/learn/course/:id",
    name: "CourseDetail",
    meta: { requiresAuth: true },
    component: () => import("./CourseDetail.vue"),
  },
];
