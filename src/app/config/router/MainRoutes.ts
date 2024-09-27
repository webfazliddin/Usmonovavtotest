import { RouteRecordRaw } from "vue-router";
const MainRoutes: RouteRecordRaw = {
  path: "/main",
  meta: {
    requiresAuth: false,
  },
  redirect: "/main",
  component: () => import("@/app/config/layouts/FullLayout.vue"),
  children: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "Dashboard",
      path: "/home",
      component: () => import("@/views/dashboard.vue"),
    },
    {
      path: "/questions",
      name: "Questions",
      component: () => import("@/views/Questions/index.vue"),
    },
    {
      path: "/questions/edit/:id",
      name: "EditQuestion",
      component: () => import("@/views/Questions/edit.vue"),
    },
  ],
};

export default MainRoutes;
