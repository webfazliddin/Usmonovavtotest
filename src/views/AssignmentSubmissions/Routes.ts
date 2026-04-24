import { RouteRecordRaw } from "vue-router";

export const AssignmentSubmissionsRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/assignment-submissions",
    name: "AssignmentSubmissions",
    meta: { requiresAuth: true },
    component: () => import("./index.vue"),
  },
];
