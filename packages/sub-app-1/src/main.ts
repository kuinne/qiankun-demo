// @ts-ignore
import './public-path.js'
import { createApp, reactive } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

let app: ReturnType<typeof createApp> | null = null
// 使用 reactive 创建响应式状态
const globalState = reactive<Record<string, any>>({})
let setGlobalState: ((state: Record<string, any>) => void) | null = null

// qiankun生命周期钩子 - 微应用初始化
function render(props: any = {}) {
  const {
    container,
    onGlobalStateChange,
    setGlobalState: setState,
    initialState,
  } = props
  const rootContainer = container
    ? container.querySelector('#app')
    : document.getElementById('app')

  // 保存全局通信方法
  setGlobalState = setState

  // 初始化全局状态
  if (initialState) {
    console.log('子应用接收到初始状态:', initialState)
    Object.keys(initialState).forEach((key) => {
      globalState[key] = initialState[key]
    })
  }

  // 监听全局状态变化
  onGlobalStateChange?.(
    (state: Record<string, any>, prev: Record<string, any>) => {
      console.log('子应用1 - 全局状态变更：', state, prev)
      // 更新响应式对象
      Object.keys(state).forEach((key) => {
        globalState[key] = state[key]
      })
    }
  )

  app = createApp(App)

  // 将通信方法注入到全局
  app.config.globalProperties.$setGlobalState = setState
  app.config.globalProperties.$globalState = globalState

  // 使用路由
  app.use(router)

  app.mount(rootContainer)
}

renderWithQiankun({
  bootstrap() {
    console.log('子应用1 bootstrap')
  },
  mount(props) {
    console.log('子应用1 mount', props)
    render(props)
  },
  unmount(props) {
    console.log('子应用1 unmount')
    if (app) {
      app.unmount()
      app = null
    }
  },
  update(props) {
    console.log('子应用1 update', props)
  },
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}

// 导出通信方法供组件使用
export { setGlobalState, globalState }
