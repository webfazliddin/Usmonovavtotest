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
      name: "Forbidden",
      component: () => import("@/views/403.vue"),
    },
    {
      path: "/sign-in",
      name: "SignIn",
      component: () => import("@/views/Auth/SignIn.vue"),
    },
    {
      path: "/traffic-marks",
      name: "Marks",
      component: () => import("@/views/TrafficMarks/MarksUser.vue"),
    },
    MainRoutes,
  ],
});

router.beforeEach(async (to, from, next) => {
  const token = getAdapter("token");
  const isAdmin = getAdapter("isAdmin") === true;

  // Check if user is authenticated
  if (!token && to.meta?.requiresAuth) {
    next({ name: "SignIn" });
    return;
  }

  // Admin-only routes protection (only block non-admin users)
  const adminOnlyRoutes = [
    "/admin/categories",
    "/admin/questions",
    "/admin/card-tests",
    "/admin/users",
    "/admin/mark-categories",
    "/admin/traffic-marks",
  ];

  const isAdminRoute = adminOnlyRoutes.some(route => to.path.startsWith(route));

  // If trying to access admin route WITHOUT admin privileges (and has token)
  // This means: if it's an admin route AND user is NOT admin AND user has token
  if (isAdminRoute && !isAdmin && token) {
    // Redirect non-admin users to forbidden page
    next({ name: "Forbidden" });
    return;
  }

  // Allow admins to access all routes
  next();
});
