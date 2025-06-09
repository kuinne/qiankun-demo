import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TabItem {
  title: string
  path: string
  name?: string
  keepAlive?: boolean
}

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<TabItem[]>([])
  const cachedViews = ref<string[]>([])

  // 添加页签
  const addTab = (tab: TabItem) => {
    if (!tabs.value.some((item) => item.path === tab.path)) {
      tabs.value.push(tab)
      // 如果需要缓存，添加到缓存列表
      if (tab.keepAlive && tab.name) {
        addCachedView(tab.name)
      }
    }
  }

  // 关闭页签
  const closeTab = (path: string) => {
    const index = tabs.value.findIndex((item) => item.path === path)
    if (index > -1) {
      const tab = tabs.value[index]
      tabs.value.splice(index, 1)
      // 如果页面被缓存，从缓存列表中移除
      if (tab.keepAlive && tab.name) {
        removeCachedView(tab.name)
      }
    }
  }

  // 添加缓存视图
  const addCachedView = (name: string) => {
    if (!cachedViews.value.includes(name)) {
      cachedViews.value.push(name)
    }
  }

  // 移除缓存视图
  const removeCachedView = (name: string) => {
    const index = cachedViews.value.indexOf(name)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  return {
    tabs,
    cachedViews,
    addTab,
    closeTab,
    addCachedView,
    removeCachedView,
  }
})
