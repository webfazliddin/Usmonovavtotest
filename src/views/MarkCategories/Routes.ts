import { RouteRecordRaw } from "vue-router";

export const MarkCategoriesRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/mark-categories",
    name: "MarkCategories",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/mark-categories/edit/:id",
    name: "EditMarkCategories",
    component: () => import("./index.vue"),
  },
];
