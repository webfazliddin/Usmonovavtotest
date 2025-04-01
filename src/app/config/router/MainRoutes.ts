import { CategoriesRoutes } from "@/views/Categories/Routes";
import { MarkCategoriesRoutes } from "@/views/MarkCategories/Routes";
import { MyCategoriesRoutes } from "@/views/MyCategories/Routes";
import { QuestionRoutes } from "@/views/Questions/Routes";
import { TrafficMarksRoutes } from "@/views/TrafficMarks/Routes";
import { UserRoutes } from "@/views/User/Routes";
import { RouteRecordRaw } from "vue-router";

const MainRoutes: RouteRecordRaw = {
  path: "/main",
  meta: {
    requiresAuth: true,
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
    ...QuestionRoutes,
    ...UserRoutes,
    ...CategoriesRoutes,
    ...MyCategoriesRoutes,
    ...MarkCategoriesRoutes,
    ...TrafficMarksRoutes,
  ],
};

export default MainRoutes;
