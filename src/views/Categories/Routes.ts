import { RouteRecordRaw } from "vue-router";

export const CategoriesRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/categories",
    name: "Categories",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/categories/edit/:id",
    name: "EditCategories",
    component: () => import("./edit.vue"),
  },
];
