import module1 from './module1.js'

console.log('这是子应用', module1)

window.mainGlobalValue = 'sub-app'

console.log('mainGlobalValue', mainGlobalValue)

const div = document.createElement('div')
div.innerHTML = '这是子应用的div'

document.body.appendChild(div)

export default {
  name: 'sub-app',
  mount() {
    console.log('sub-app mount')
  },
  unmount() {
    console.log('sub-app unmount')
  },
}
