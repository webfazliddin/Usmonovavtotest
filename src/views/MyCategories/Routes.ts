import { RouteRecordRaw } from "vue-router";

export const MyCategoriesRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/my-categories",
    name: "MyCategories",
    component: () => import("./index.vue"),
  },
];
