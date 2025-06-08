// 简易版qiankun处理ES模块的实现

// 1. 创建沙箱环境
function createSandbox(appName) {
  // 记录原始window属性
  const originalWindow = {}
  const addedProps = new Set()

  // 用于存储ES模块的沙箱上下文
  const esModuleContext = {}

  // 创建代理对象
  const proxy = new Proxy(window, {
    // 获取属性时优先从代理对象获取，没有则从原始window获取
    get(target, prop) {
      return proxy.hasOwnProperty(prop) ? proxy[prop] : window[prop]
    },

    // 设置属性时记录新增的属性
    set(target, prop, value) {
      if (!window.hasOwnProperty(prop)) {
        addedProps.add(prop)
      } else if (!originalWindow.hasOwnProperty(prop)) {
        // 首次修改window原有属性时，记录原始值
        originalWindow[prop] = window[prop]
      }

      window[prop] = value
      return true
    },
  })

  // 沙箱挂载和卸载方法
  return {
    proxy,
    esModuleContext,
    mount() {
      // 沙箱挂载时不需要特殊处理
      return Promise.resolve()
    },
    unmount() {
      // 恢复原始属性
      Object.keys(originalWindow).forEach((key) => {
        window[key] = originalWindow[key]
      })

      // 删除新增属性
      addedProps.forEach((key) => {
        delete window[key]
      })

      // 清理可能存在的模块脚本元素
      document
        .querySelectorAll(`script[data-app-name="${appName}"]`)
        .forEach((script) => script.remove())

      return Promise.resolve()
    },
  }
}

// 2. 处理HTML模板，提取脚本
function processTpl(template) {
  const scripts = []
  let entry = null

  // 简化版：仅提取script标签
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi
  const srcRegex = /\ssrc=(['"])(.*?)\1/i
  const typeRegex = /\stype=(['"])(.*?)\1/i
  const entryRegex = /\sentry\b/i

  // 处理模板
  const processedTemplate = template.replace(scriptRegex, (match) => {
    // 检查是否是ES模块
    const typeMatch = match.match(typeRegex)
    const isModule = typeMatch && typeMatch[2] === 'module'

    // 提取src
    const srcMatch = match.match(srcRegex)
    if (srcMatch) {
      const src = srcMatch[2]
      const isEntry = entryRegex.test(match)

      if (isEntry) {
        entry = src
      }

      // 记录脚本信息
      scripts.push({
        src,
        isModule,
        isEntry,
      })

      // 替换为注释
      return `<!-- script ${src} replaced -->`
    } else {
      // 内联脚本
      const code = match.replace(/<script\b[^>]*>|<\/script>/gi, '')
      scripts.push({
        code,
        isModule,
        isInline: true,
      })
      return `<!-- inline script replaced -->`
    }
  })

  return {
    template: processedTemplate,
    scripts,
    entry,
  }
}

// 3. 加载外部脚本
async function loadExternalScripts(scripts, entry) {
  const scriptPromises = scripts
    .filter((script) => script.src) // 只处理外部脚本
    .map(async (script) => {
      try {
        const response = await fetch(new URL(script.src, entry))
        if (!response.ok) {
          throw new Error(`Failed to load script: ${script.src}`)
        }

        const code = await response.text()
        return {
          ...script,
          code,
        }
      } catch (error) {
        console.error(error)
        return {
          ...script,
          error,
        }
      }
    })

  return Promise.all(scriptPromises)
}

// 4. 执行脚本的核心函数
function getExecutableScript(scriptSrc, code, proxy) {
  const sourceUrl = scriptSrc ? `\n//# sourceURL=${scriptSrc}` : ''

  // 创建一个可执行的代码字符串，将全局对象替换为代理对象
  return `
    (function(window, self, globalThis) {
      ${code}${sourceUrl}
    }).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
  `
}

// 5. 执行脚本
function evalCode(scriptSrc, code) {
  try {
    // 使用Function构造函数而不是eval，更安全
    const execFunc = new Function(code)
    execFunc()
    return true
  } catch (error) {
    console.error(`Error executing script ${scriptSrc}:`, error)
    return false
  }
}

// 创建一个隔离的iframe来执行ES模块
function createModuleIframe(appName) {
  // 检查是否已存在
  const existingIframe = document.getElementById(`module-iframe-${appName}`)
  if (existingIframe) {
    return existingIframe.contentWindow
  }

  // 创建新iframe
  const iframe = document.createElement('iframe')
  iframe.id = `module-iframe-${appName}`
  iframe.style.cssText =
    'display:none;position:absolute;width:0;height:0;border:0;'
  document.body.appendChild(iframe)

  // 初始化iframe内容
  const iframeDoc = iframe.contentDocument
  iframeDoc.open()
  iframeDoc.write('<!DOCTYPE html><html><head></head><body></body></html>')
  iframeDoc.close()

  return iframe.contentWindow
}

// 6. 主要的执行脚本函数
async function execScripts(scripts, sandbox, entry) {
  const { proxy, esModuleContext } = sandbox

  // 设置全局代理，使得普通脚本在代理环境中执行
  window.proxy = proxy

  // 创建一个模块注册表，用于跟踪已加载的模块
  const moduleRegistry = new Map()

  // 获取或创建模块iframe
  const moduleIframe = createModuleIframe(sandbox.appName)

  // 按顺序执行脚本
  for (const script of scripts) {
    if (script.error) {
      console.error(`Skipping script due to load error: ${script.src}`)
      continue
    }

    // 处理ES模块
    if (script.isModule) {
      // 对于ES模块，我们需要创建一个type="module"的script元素
      // 但放在隔离的iframe中执行
      const moduleScript = moduleIframe.document.createElement('script')
      moduleScript.type = 'module'
      moduleScript.setAttribute('data-app-name', sandbox.appName)

      // 将import语句中的路径转换为绝对路径
      const processedCode = script.code.replace(
        /import\s+(.*?)\s+from\s+(['"])(.*?)\2/g,
        (match, importName, quote, path) => {
          if (path.startsWith('./') || path.startsWith('../')) {
            // 转换相对路径
            const base = script.src ? new URL(script.src, entry).href : entry
            const absolutePath = new URL(path, base).href
            return `import ${importName} from ${quote}${absolutePath}${quote}`
          }
          return match
        }
      )

      // 添加模块导出到沙箱上下文的代码
      const wrappedCode = `
        ${processedCode}
        
        // 将模块导出到父窗口的沙箱上下文
        try {
          const moduleId = '${script.src || 'inline-' + Math.random()}';
          if (typeof exports !== 'undefined') {
            window.parent.postMessage({
              type: 'moduleExports',
              moduleId: moduleId,
              exports: Object.keys(exports)
            }, '*');
          }
        } catch(e) {
          console.error('Failed to export module:', e);
        }
      `

      moduleScript.textContent = wrappedCode

      // 监听来自iframe的消息
      const moduleExportPromise = new Promise((resolve) => {
        const messageHandler = (event) => {
          if (
            event.data &&
            event.data.type === 'moduleExports' &&
            event.data.moduleId === (script.src || 'inline-' + Math.random())
          ) {
            window.removeEventListener('message', messageHandler)
            resolve(event.data.exports)
          }
        }
        window.addEventListener('message', messageHandler)
      })

      // 添加到iframe中执行
      moduleIframe.document.head.appendChild(moduleScript)

      // 等待模块导出，并存储到注册表
      try {
        const exports = await moduleExportPromise

        if (exports) {
          moduleRegistry.set(script.src || 'inline-module', exports)
        }
      } catch (err) {
        console.error('Error processing module exports:', err)
      }
    } else {
      // 非ES模块直接执行
      const executableCode = getExecutableScript(script.src, script.code, proxy)
      evalCode(script.src, executableCode)
    }
  }

  // 存储模块注册表到沙箱上下文
  esModuleContext.moduleRegistry = moduleRegistry
}

// 7. 加载微应用的主函数
export async function loadApp(app) {
  const { name, entry } = app

  // 创建沙箱
  const sandbox = createSandbox(name)
  sandbox.appName = name
  const { proxy, mount, unmount } = sandbox

  try {
    // 获取HTML内容
    const response = await fetch(entry)
    const html = await response.text()

    // 处理HTML模板
    const { template, scripts } = processTpl(html)

    // 加载外部脚本
    const loadedScripts = await loadExternalScripts(scripts, entry)

    // 将内联脚本与加载的外部脚本合并
    const allScripts = [
      ...loadedScripts,
      ...scripts.filter((script) => script.isInline),
    ]

    // 返回生命周期函数
    return {
      bootstrap: async () => {
        console.log(`${name} bootstrapping`)
      },
      mount: async () => {
        console.log(`${name} mounting`)
        await mount()
        // 执行所有脚本
        await execScripts(allScripts, sandbox, entry)
      },
      unmount: async () => {
        console.log(`${name} unmounting`)
        await unmount()

        // 移除模块iframe
        const moduleIframe = document.getElementById(`module-iframe-${name}`)
        if (moduleIframe) {
          document.body.removeChild(moduleIframe)
        }
      },
    }
  } catch (error) {
    console.error(`Failed to load app ${name}:`, error)
    throw error
  }
}
