import { type Router } from 'vue-router'
import { isSubAppRoute } from 'common'
import { useMicroApps } from './useMicroApps'

export const useRouteGuard = (router: Router) => {
  // 初始化微应用
  const { getMicroAppByPath, unmountMicroApp } = useMicroApps()

  // 路由守卫
  router.beforeEach(async (to, from, next) => {
    console.log(`路由守卫 - 路由变化: 从 ${from.path} 到 ${to.path}`)

    try {
      const isToMicroApp = isSubAppRoute(to.path)
      const currentSubAppConfig = getMicroAppByPath(
        router.currentRoute.value.path
      )

      // 如果当前有子应用且目标不是同一个子应用，需要卸载当前子应用
      if (
        currentSubAppConfig &&
        (!isToMicroApp ||
          getMicroAppByPath(to.path)?.name !== currentSubAppConfig.name)
      ) {
        await unmountMicroApp()
      }

      next()
    } catch (error) {
      console.error('路由守卫中发生错误:', error)
      next()
    }
  })
}
