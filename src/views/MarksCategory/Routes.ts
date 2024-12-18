import { RouteRecordRaw } from "vue-router";

export const MarkCategoryRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/mark-category",
    name: "MarkCategory",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/mark-category/edit/:id",
    name: "EditMarkCategory",
    component: () => import("./edit.vue"),
  },
];
