import { RouteRecordRaw } from "vue-router";

export const AuthRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Auth/LoginForm.vue"),
  },
];
