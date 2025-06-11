import { MicroAppManager, type MicroAppConfig } from 'common'
import { computed, reactive, ref, watch } from 'vue'

// 创建子应用管理器实例
const microAppManager = reactive(new MicroAppManager())

// 子应用配置列表
const microAppsConfig: MicroAppConfig[] = [
  {
    name: 'sub-app-1',
    entry: '//localhost:5001',
    activeRule: '/sub-app/sub-app-1/',
    defaultPath: '/sub-app/sub-app-1/',
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
    activeRule: '/sub-app/sub-app-2/',
    defaultPath: '/sub-app/sub-app-2/',
    title: '子应用2',
    menus: [
      { title: '首页', path: '/sub-app/sub-app-2/', icon: 'HomeFilled' },
      { title: '关于', path: '/sub-app/sub-app-2/about', icon: 'InfoFilled' },
      { title: '用户', path: '/sub-app/sub-app-2/user', icon: 'UserFilled' },
    ],
  },
]

const defaultPathMap = reactive<Record<string, string>>({})

export const useMicroApps = () => {
  const microApps = reactive(microAppsConfig)
  const mountMicroApp = async (
    appConfig: MicroAppConfig,
    containerId: string
  ) => {
    if (microAppManager.hasMicroApp(appConfig.name)) {
      console.log(`子应用 ${appConfig.name} 已经加载，无需重新加载`)
      return
    }
    await microAppManager.mount(appConfig.name, appConfig.entry, containerId)
  }

  // 卸载当前子应用的函数
  const unmountMicroApp = async (appName: string) => {
    await microAppManager.unmount(appName)
  }

  const getMicroAppConfigByPath = (path: string) => {
    return microAppsConfig.find((app) => {
      if (path.startsWith(app.activeRule)) {
        return app
      }
    })
  }

  const getLoadedMicroAppByPath = (path: string) => {
    const microAppConfig = getMicroAppConfigByPath(path)
    if (!microAppConfig) return
    return microAppManager.getMicroApp(microAppConfig.name)
  }

  const updateMicroAppDefaultPath = (name: string, path: string) => {
    defaultPathMap[name] = path
  }

  const getMicroAppDefaultPath = (name: string) => {
    return defaultPathMap[name]
  }

  return {
    microApps,
    microAppsConfig,
    getLoadedMicroAppByPath,
    getMicroAppConfigByPath,
    mountMicroApp,
    unmountMicroApp,
    updateMicroAppDefaultPath,
    getMicroAppDefaultPath,
  }
}
