import { createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import { useAdapter } from "@/utils/useAdapter";
import { CardRoutes } from "@/views/Card/Routes";

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

    {
      path: "/admin/complete-test",
      name: "CompleteTest",
      component: () => import("@/views/MyCategories/CompletePage.vue"),
    },
    {
      path: "/result/:attemptId",
      name: "ResultPage",
      component: () => import("@/views/MyCategories/ResultPage.vue"),
    },
    ...CardRoutes,
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
