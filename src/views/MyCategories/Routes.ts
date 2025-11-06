import { RouteRecordRaw } from "vue-router";

export const MyCategoriesRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/my-categories",
    name: "MyCategories",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/complete-test",
    name: "CompleteTest",
    component: () => import("./CompletePage.vue"),
  },
  {
    path: "/result/:attemptId",
    name: "ResultPage",
    component: () => import("./ResultPage.vue"),
  },
];
