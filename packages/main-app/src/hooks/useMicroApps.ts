import { useRoute } from 'vue-router'
import { getSubAppByPath, MicroAppManager, type MicroAppConfig } from 'common'
import { computed, reactive } from 'vue'

// 创建子应用管理器实例
const microAppManager = reactive(new MicroAppManager())

export const useMicroApps = () => {
  // 子应用配置列表
  const microApps: MicroAppConfig[] = [
    {
      name: 'sub-app-1',
      entry: '//localhost:5001',
      activeRule: '/sub-app/sub-app-1',
      container: '#sub-app-viewport',
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
      activeRule: '/sub-app/sub-app-2',
      container: '#sub-app-viewport',
      defaultPath: '/sub-app/sub-app-2/',
      title: '子应用2',
      menus: [
        { title: '首页', path: '/sub-app/sub-app-2/', icon: 'HomeFilled' },
        { title: '关于', path: '/sub-app/sub-app-2/about', icon: 'InfoFilled' },
        { title: '用户', path: '/sub-app/sub-app-2/user', icon: 'UserFilled' },
      ],
    },
  ]

  const route = useRoute()

  // 当前加载完成的子应用
  const currentLoadedApp = computed(() => {
    return microApps.find(
      (app) => app.name === microAppManager.getCurrentAppName()
    )
  })

  const mountMicroApp = async () => {
    // 根据当前路由决定加载哪个子应用
    const currentPath = route.path
    console.log(`容器准备好，准备加载子应用，当前路径: ${currentPath}`)

    // 获取当前路径对应的子应用配置
    const subAppConfig = getSubAppByPath(currentPath, microApps)
    if (!subAppConfig) {
      console.log(`当前路径 ${currentPath} 没有对应的子应用配置`)
      return
    }

    // 如果当前已有子应用在运行，且与目标路径不匹配，先卸载
    const currentAppName = microAppManager.getCurrentAppName()
    if (currentAppName) {
      if (currentAppName !== subAppConfig.name) {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 不匹配，准备卸载`
        )
        await microAppManager.unmount(currentAppName)
      } else {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 匹配，无需重新加载`
        )
        return
      }
    }

    // 加载子应用
    console.log(`准备加载子应用 ${subAppConfig.name}`)
    await microAppManager.mount(
      subAppConfig.name,
      subAppConfig.entry,
      subAppConfig.container
    )
  }

  // 卸载当前子应用的函数
  const unmountMicroApp = async () => {
    const currentAppName = microAppManager.getCurrentAppName()
    if (currentAppName) {
      await microAppManager.unmount(currentAppName)
    }
  }

  const getMicroAppByPath = (path: string) => {
    return microApps.find((app) => {
      if (path.startsWith(app.activeRule)) {
        return app
      }
    })
  }

  return {
    microApps,
    currentLoadedApp,
    getMicroAppByPath,
    mountMicroApp,
    unmountMicroApp,
  }
}
