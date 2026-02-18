import { RouteRecordRaw } from "vue-router";

export const MyCategoriesRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/my-categories",
    name: "MyCategories",
    component: () => import("./index.vue"),
  },
  {
    path: "/result/:attemptId",
    name: "ResultPage",
    component: () => import("./ResultPage.vue"),
  },
];

export const CompleteTestRoute: RouteRecordRaw = {
  path: "/admin/complete-test",
  name: "CompleteTest",
  meta: { requiresAuth: true },
  component: () => import("./CompletePage.vue"),
};
