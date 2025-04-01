import { RouteRecordRaw } from "vue-router";

export const TrafficMarksRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/traffic-marks",
    name: "TrafficMarks",
    component: () => import("./index.vue"),
  },
  {
    path: "/admin/trafficMarks/edit/:id",
    name: "EditTrafficMarks",
    component: () => import("./index.vue"),
  },
];
