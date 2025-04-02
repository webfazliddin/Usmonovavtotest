import { RouteRecordRaw } from "vue-router";

export const CardRoutes: RouteRecordRaw[] = [
  {
    path: "/card",
    name: "Card",
    component: () => import("./index.vue"),
  },
  {
    path: "/card-test/:cardId",
    name: "CardTest",
    component: () => import("@/features/Test/CardTest.vue"),
  },
];
