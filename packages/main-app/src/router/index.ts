import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: 'home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'app-list',
        name: 'AppList',
        component: () => import('../views/AppList.vue'),
        meta: {
          title: '应用列表',
          icon: 'Grid',
          closable: false,
        },
      },
    ],
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
