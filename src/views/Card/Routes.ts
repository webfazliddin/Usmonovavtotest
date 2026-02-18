import { RouteRecordRaw } from "vue-router";

// FullLayout ichida ko'rinadigan route (sidebar bilan)
export const CardRoutes: RouteRecordRaw[] = [
  {
    path: "/card",
    name: "Card",
    component: () => import("./index.vue"),
  },
];

// Fullscreen (standalone) routelar — sidebar yo'q
export const CardFullscreenRoutes: RouteRecordRaw[] = [
  {
    path: "/card-test/:cardId",
    name: "CardTest",
    meta: { requiresAuth: true },
    component: () => import("./CardTest.vue"),
  },
  {
    path: "/card-result/:attemptId",
    name: "CardResultPage",
    meta: { requiresAuth: true },
    component: () => import("./CardResultPage.vue"),
  },
];
