const proxyWindow = new Proxy(window, {
  get(target, key) {
    console.log('get', key)
    return target[key]
  },
})

const fakeWindow = {
  hello: 'world',
}

const source = `

(function(proxyWindow){
with(proxyWindow) {

console.log("window", window)
}
})(this.__proxy__)
`

const source2 = `
import bar from "./bar.js";
console.log("bar", bar);

`

// const scriptCode = new Function('proxyWindow', source)

// scriptCode(proxyWindow)

const newScript = document.createElement('script')
newScript.setAttribute('type', 'module')
newScript.textContent = source2
document.body.appendChild(newScript)
document.body.removeChild(newScript)
