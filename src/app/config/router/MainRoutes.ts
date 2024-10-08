import { RouteRecordRaw } from "vue-router";

const MainRoutes: RouteRecordRaw = {
  path: "/main",
  component: () => import("@/app/config/layout/FullLayout.vue"),
  children: [
    {
      path: "/main",
      redirect: "/",
    },
  ],
};
export default MainRoutes;
