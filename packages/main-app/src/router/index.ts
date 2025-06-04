import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/sub-app-1/:page*",
    name: "SubApp1",
    component: () => import("../views/SubAppContainer.vue"),
  },
  {
    path: "/sub-app-2/:page*",
    name: "SubApp2",
    component: () => import("../views/SubAppContainer.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
