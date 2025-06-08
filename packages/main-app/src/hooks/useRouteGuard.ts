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
      const isFromMicroApp = isSubAppRoute(from.path)
      const currentSubAppConfig = getMicroAppByPath(
        router.currentRoute.value.path
      )

      // 如果要去子应用路由
      if (isToMicroApp) {
        // 获取目标子应用配置
        const toMicroAppConfig = getMicroAppByPath(to.path)

        // 如果从主应用来，或者从不同的子应用来，需要确保先卸载当前子应用
        if (
          !isFromMicroApp ||
          (currentSubAppConfig &&
            currentSubAppConfig.name !== toMicroAppConfig?.name)
        ) {
          // 从主应用或其他子应用切换，需要卸载当前子应用
          if (currentSubAppConfig) {
            await unmountMicroApp()
          }
        }
      } else {
        // 如果去往主应用，卸载当前子应用
        if (currentSubAppConfig) {
          await unmountMicroApp()
        }
      }
      next()
    } catch (error) {
      console.error('路由守卫中发生错误:', error)
      next()
    }
  })
}
