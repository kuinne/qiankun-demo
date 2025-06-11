import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  // 通用子应用路由，用于处理未知子应用
  // {
  //   path: "/sub-app/:appName/:page*",
  //   name: "SubAppGeneric",
  //   component: () => import("../views/SubAppContainer.vue"),
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
