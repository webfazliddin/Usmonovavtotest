import { RouteRecordRaw } from "vue-router";

export const MyCoursesRoutes: RouteRecordRaw[] = [
  {
    path: "/my-courses",
    name: "MyCoursesList",
    meta: { requiresAuth: true },
    component: () => import("./index.vue"),
  },
];
