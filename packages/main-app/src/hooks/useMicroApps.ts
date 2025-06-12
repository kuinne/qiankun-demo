import { MicroAppManager, type MenuItem, type MicroAppConfig } from 'common'
import { computed, defineComponent, h, reactive, ref, watch } from 'vue'
import { useRoute, type Router } from 'vue-router'
import MicroAppContainer from '../components/MicroAppContainer.vue'

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

export class MicroApp {
  name: string
  entry: string
  activeRule: string
  title: string
  menus: MenuItem[]
  defaultPath: string
  isMounted: boolean = false
  constructor(config: MicroAppConfig) {
    this.name = config.name
    this.entry = config.entry
    this.activeRule = config.activeRule
    this.title = config.title
    this.menus = config.menus
    this.defaultPath = config.menus[0].path
  }

  updateDefaultPath(path: string) {
    this.defaultPath = path
  }
}

const microApps = ref(microAppsConfig.map((config) => new MicroApp(config)))

export const useMicroApps = () => {
  const route = useRoute()

  const currentRouteMicroApp = computed(() => {
    return microApps.value.find((app) => {
      if (route.path.startsWith(app.activeRule)) {
        return app
      }
    })
  })
  const mountMicroApp = async (microApp: MicroApp, containerId: string) => {
    if (microAppManager.hasMicroApp(microApp.name)) {
      console.log(`子应用 ${microApp.name} 已经加载，无需重新加载`)
      return
    }
    await microAppManager.mount(microApp.name, microApp.entry, containerId)
  }

  // 卸载当前子应用的函数
  const unmountMicroApp = async (appName: string) => {
    await microAppManager.unmount(appName)
  }

  const getMicroAppByPath = (path: string) => {
    return microApps.value.find((app) => {
      if (path.startsWith(app.activeRule)) {
        return app
      }
    })
  }

  const createMicroAppRoute = (microApp: MicroApp, router: Router) => {
    router.addRoute({
      path: `${microApp.activeRule}:pathMatch(.*)`,
      name: microApp.name,
      props: {
        microApp: microApp,
        containerId: `${microApp.name}-${Date.now()}`,
      },
      meta: {
        cacheKey: microApp.name,
      },
      component: defineComponent({
        name: microApp.name,
        render() {
          return h(MicroAppContainer, {
            microApp: microApp,
            containerId: `${microApp.name}-${Date.now()}`,
          })
        },
      }),
    })
  }

  return {
    microApps,
    currentRouteMicroApp,
    mountMicroApp,
    unmountMicroApp,
    getMicroAppByPath,
    createMicroAppRoute,
  }
}
