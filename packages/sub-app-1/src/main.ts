// @ts-ignore
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'
import bar from './bar'

console.log('bar', bar)

renderWithQiankun({
  bootstrap() {
    console.log('子应用1 bootstrap')
  },
  mount(props) {
    console.log('子应用1 mount', props)
  },
  unmount(props) {
    console.log('子应用1 unmount')
  },
  update(props) {
    console.log('子应用1 update', props)
  },
})
