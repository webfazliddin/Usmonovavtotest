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
    component: () => import("./CardTest.vue"),
  },
  {
    path: "/card-result/:attemptId",
    name: "CardResultPage",
    component: () => import("./CardResultPage.vue"),
  },
];
