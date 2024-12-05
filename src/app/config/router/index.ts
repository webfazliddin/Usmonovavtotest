import { createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import { useAdapter } from "@/utils/useAdapter";

const { getAdapter } = useAdapter();

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/Error.vue"),
    },
    {
      path: "/error/403",
      component: () => import("@/views/403.vue"),
    },
    {
      path: "/sign-in",
      name: "SignIn",
      component: () => import("@/views/Auth/SignIn.vue"),
    },
    MainRoutes,
  ],
});
router.beforeEach(async (to, from, next) => {
  if (!getAdapter("token") && to.meta?.requiresAuth) {
    next({ name: "SignIn" });
    return;
  }
  next();
});
