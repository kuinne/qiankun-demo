import { ref } from 'vue'

export interface TabItem {
  key: string
  path: string
  title: string
  microAppName?: string
}

const tabs = ref<TabItem[]>([])

export const useTabNav = () => {
  // 添加页签
  const addTab = (tab: TabItem) => {
    if (!tabs.value.some((item) => item.key === tab.key)) {
      tabs.value.push(tab)
    }
  }

  // 关闭页签
  const closeTab = (key: string) => {
    const index = tabs.value.findIndex((item) => item.key === key)
    if (index > -1) {
      tabs.value.splice(index, 1)
    }
  }

  // 更新页签
  const updateTab = (tab: TabItem) => {
    const index = tabs.value.findIndex((item) => item.key === tab.key)
    if (index > -1) {
      tabs.value[index] = tab
    }
  }

  return {
    tabs,
    addTab,
    closeTab,
    updateTab,
  }
}
