// import { loadApp } from './helper.js'

// window.mainGlobalValue = 'main-app'

// const app = await loadApp({
//   name: 'vue-app',
//   entry: 'http://localhost:3001/',
// })

// await app.bootstrap()
// await app.mount()

function main() {
  window.hello = 'hello'
  const entry = 'http://localhost:3001/'

  const code = `
import module1 from './module1.js'
console.log('这是子应用', module1)
console.log('hello', hello)
`

  const proxy = new Proxy(window, {
    get(target, prop) {
      return proxy.hasOwnProperty(prop) ? proxy[prop] : window[prop]
    },
    set(target, prop, value) {
      window[prop] = value
      return true
    },
  })

  const processedCode = code.replace(
    /import\s+.*?\s+from\s+(['"])(.*?)\1/g,
    (match, quote, path) => {
      return `import module1 from ${quote}${new URL(path, entry).href}${quote};`
    }
  )

  const moduleScript = document.createElement('script')
  moduleScript.type = 'module'
  moduleScript.textContent = processedCode
  document.head.appendChild(moduleScript)
}
// main()

async function main2() {
  const entry = 'http://localhost:3001/'

  //     const htmlCode = `
  //   <html>
  //   <body>
  //     <div id="app"></div>
  //     <script type="module" src="./test.js"></script>
  //   </body>
  //   </html>
  // `

  const htmlCode = await fetch(entry).then((res) => res.text())

  // 用正则表达式提取 scriptCode
  const scriptCode = htmlCode.match(/<script src="([^"]+)" type="module">/)[1]

  // 将scriptCode 包装成通过 import()获取模块的代码
  const processedCode = `
  import("${new URL(scriptCode, entry).href}").then(module => {
    console.log('module', module)
  })
  `
  window.hello = 'hello'
  const proxy = new Proxy(window, {
    get(target, prop) {
      return proxy.hasOwnProperty(prop) ? proxy[prop] : window[prop]
    },
    set(target, prop, value) {
      window[prop] = value
      return true
    },
  })

  window.proxy = proxy

  const wrappedCode = `
  (function(){
   ${processedCode}
  }).bind(window.proxy)(window.proxy);
  `

  // 通过eval 执行 processedCode
  eval(wrappedCode)
}

main2()
