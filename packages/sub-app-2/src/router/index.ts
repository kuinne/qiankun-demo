import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
  },
];

// 判断是否是微前端环境
const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__;

const router = createRouter({
  history: createWebHistory(isQiankun ? "/sub-app-2" : "/"),
  routes,
});

export default router;
