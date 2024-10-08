import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import MainRoutes from "./MainRoutes";
import { AuthRoutes } from "@/views/Auth/Routes";

const routes: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404.vue"),
  },
  MainRoutes,
  {
    path: "/error/403",
    component: () => import("@/views/403.vue"),
  },
  ...AuthRoutes,
];
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, _from, _savedPosition) {
    if (to.meta.retainScroll) {
      return false; // Don't scroll to top if retainScroll is true
    } else {
      return { top: 0 }; // Scroll to top by default
    }
  },
});
// @ts-expect-error
router.beforeEach(async (to, from, next) => {
  next();
});
