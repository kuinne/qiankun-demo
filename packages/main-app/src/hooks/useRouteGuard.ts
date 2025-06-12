import { type Router } from 'vue-router'
import { isSubAppRoute } from 'common'
import { useMicroApps } from './useMicroApps'
import { useTabNav } from './useTabNav'

export const useRouteGuard = (router: Router) => {
  // 初始化微应用
  const { getMicroAppByPath, createMicroAppRoute } = useMicroApps()
  const { addTab } = useTabNav()

  // 路由守卫
  router.beforeEach(async (to, from, next) => {
    console.log(`路由守卫 - 路由变化: 从 ${from.path} 到 ${to.path}`)

    try {
      const isToMicroApp = isSubAppRoute(to.path)

      if (isToMicroApp) {
        const toMicroApp = getMicroAppByPath(to.path)

        if (toMicroApp) {
          const toMicroAppMenu = toMicroApp.menus.find(
            (menu) => menu.path === to.path
          )
          if (toMicroAppMenu) {
            // 添加页签
            addTab({
              key: toMicroAppMenu.path,
              path: to.path,
              title: toMicroAppMenu.title,
              microAppName: toMicroApp.name,
            })

            toMicroApp.updateDefaultPath(to.path)
          }
          if (!router.hasRoute(toMicroApp.name)) {
            createMicroAppRoute(toMicroApp, router)
            next({ ...to, replace: true })
          }
        }
      }

      next()
    } catch (error) {
      console.error('路由守卫中发生错误:', error)
      next()
    }
  })
}
