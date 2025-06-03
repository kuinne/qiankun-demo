class Qiankun {
  constructor() {
    this.apps = [] // 注册的子应用
    this.sandboxes = new Map() // 沙箱实例映射
  }

  // 注册子应用
  registerMicroApp(appConfig) {
    this.apps.push(appConfig)
  }

  // 路由变化时触发
  routeChange() {
    const path = window.location.pathname

    // 查找匹配的子应用
    const app = this.apps.find((a) => path.startsWith(a.activeRule))

    if (app) {
      this.loadApp(app)
    }
  }

  // 加载子应用
  async loadApp(app) {
    // 1. 清理前一个应用
    this.unmountPrevApp()

    // 2. 创建沙箱
    const sandbox = this.createSandbox(app.name)
    this.sandboxes.push(sandbox)

    // 3. HTML Entry 核心逻辑
    const htmlContent = await fetch(app.entry).then((res) => res.text()) // 获取 HTML
    const domParser = new DomParser()
    const doc = domParser.parseFromString(htmlContent, 'text/html') // 解析 DOM

    // 4. 样式隔离处理
    this.loadStyles(doc, app)

    // 5. 执行脚本
    this.executeScripts(doc, sandbox)

    // 6.挂载子应用
    sandbox.mount(app.container)
  }

  // 创建 JS 沙箱
  createSandbox(appName) {
    const fakeWindow = {}

    const proxy = new Proxy(window, {
      get(target, key) {
        // 优先从沙箱 fakeWindow 读取
        return fakeWindow[key] || target[key]
      },
      set(target, key, value) {
        // 写入沙箱 fakeWindow
        fakeWindow[key] = value
        return true
      },
    })

    return {
      proxy,
      mount(container) {
        console.log(`[${appName}] Mounted`)
        // 实际应用挂载解析后的 DOM
        container.innerHTML = `<h2>${appName} Content</h2>`
      },
      unmount() {
        console.log(`[${appName}] Unmounted`)
        // 清理工作
        Object.keys(fakeWindow).forEach((key) => delete fakeWindow[key])
      },
    }
  }

  // 样式隔离实现
  loadStyles(doc, app) {
    const styleNodes = doc.querySelectorAll('style, link[rel="stylesheet"')

    styleNodes.forEach((node) => {
      // Scoped CSS 实现
      if (node.tagName == 'STYLE') {
        const scopedCSS = `[data-qiankun="${app.name}"] ${node.textContent}`
        const style = document.createElement('style')
        style.textContent = scopedCSS
        document.head.appendChild(style)
      }
      // 记录样式以便卸载
      app.styles = app.styles || []
      app.styles.push(style)
    })
  }

  // 执行脚本
  executeScripts(doc, sandbox) {
    const scripts = doc.querySelectorAll('script')
    scripts.forEach((script) => {
      const newScript = document.createElement('script')
      newScript.textContent = `
            // 将代码包裹在沙箱环境中执行
            (function(proxyWindow){
                with(proxyWindow) {
                    ${script.textContent}
                }
            })(this.__proxy__)
            `

      // 将沙箱代理暴露给脚本
      newScript.__proxy__ = sandbox.proxy
      document.body.appendChild(newScript)
      document.body.removeChild(newScript)
    })
  }

  // 卸载前一个应用
  unmountPrevApp() {
    this.sandboxes.forEach((sandbox) => sandbox.unmount)
    this.sandboxes.clear()
  }
}

// 使用示例 - 主应用
const qiankun = new Qiankun()

// 注册子应用
qiankun.registerMicroApp({
  name: 'app1',
  entry: '//localhost:7101',
  container: document.getElementById('subapp'),
  activeRule: '/app1',
})

// 监听路由变化
window.addEventListener('popstate', () => qiankun.routeChange())
