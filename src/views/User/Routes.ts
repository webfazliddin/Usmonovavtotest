import { RouteRecordRaw } from "vue-router";

export const UserRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/users",
    name: "Users",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/user/edit/:id",
    name: "EditUsers",
    component: () => import("./edit.vue"),
  },
];
