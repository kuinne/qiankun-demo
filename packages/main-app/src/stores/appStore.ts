import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MicroApp {
  name: string
  title: string
  entry: string
  description?: string
  icon?: string
  iconColor?: string
  defaultPath?: string
}

export const useAppStore = defineStore('app', () => {
  const appList = ref<MicroApp[]>([
    {
      name: 'vue-app',
      title: 'Vue 应用',
      entry: '//localhost:8081',
      description: '基于 Vue 3 开发的子应用',
      icon: 'Monitor',
      iconColor: '#42b983',
      defaultPath: '/',
    },
    {
      name: 'react-app',
      title: 'React 应用',
      entry: '//localhost:8082',
      description: '基于 React 开发的子应用',
      icon: 'Connection',
      iconColor: '#61dafb',
      defaultPath: '/',
    },
  ])

  // 获取应用列表
  const getAppList = () => {
    return appList.value
  }

  // 根据名称获取应用
  const getAppByName = (name: string) => {
    return appList.value.find((app) => app.name === name)
  }

  return {
    appList,
    getAppList,
    getAppByName,
  }
})
