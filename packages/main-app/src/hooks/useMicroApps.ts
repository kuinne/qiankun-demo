import { useRoute } from 'vue-router'
import type { MicroAppConfig } from 'common'
import { computed } from 'vue'

export const useMicroApps = () => {
  const route = useRoute()

  // 子应用配置列表
  const microApps: MicroAppConfig[] = [
    {
      name: 'sub-app-1',
      entry: '//localhost:5001',
      activeRule: '/sub-app/sub-app-1',
      container: '#sub-app-viewport',
      defaultPath: '/sub-app/sub-app-1',
      title: '子应用1',
      menus: [
        { title: '首页', path: '/sub-app/sub-app-1/', icon: 'HomeFilled' },
        { title: '关于', path: '/sub-app/sub-app-1/about', icon: 'InfoFilled' },
        { title: '用户', path: '/sub-app/sub-app-1/user', icon: 'UserFilled' },
      ],
    },
    {
      name: 'sub-app-2',
      entry: '//localhost:5002',
      activeRule: '/sub-app/sub-app-2',
      container: '#sub-app-viewport',
      defaultPath: '/sub-app/sub-app-2',
      title: '子应用2',
      menus: [
        { title: '首页', path: '/sub-app/sub-app-2/', icon: 'HomeFilled' },
        { title: '关于', path: '/sub-app/sub-app-2/about', icon: 'InfoFilled' },
        { title: '用户', path: '/sub-app/sub-app-2/user', icon: 'UserFilled' },
      ],
    },
  ]

  // 判断当前路径是否属于某个子应用
  const isActiveApp = (appActiveRule: string) => {
    return route?.path.startsWith(appActiveRule)
  }

  // 获取当前激活的子应用
  const getCurrentApp = () => {
    return microApps.find((app) => isActiveApp(app.activeRule))
  }

  const currentApp = computed(() => getCurrentApp())

  return {
    microApps,
    currentApp,
    isActiveApp,
    getCurrentApp,
  }
}
