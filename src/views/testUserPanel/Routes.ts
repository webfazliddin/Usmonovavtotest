import { RouteRecordRaw } from "vue-router";

export const testUserPanelRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/testUserPanel",
    name: "testUserPanelRoutes",
    component: () => import("./index.vue"),
  },
];
