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
    component: () => import("./index.vue"),
  },
];
