<template>
  <div class="tab-nav" v-if="tabs.length > 0">
    <div class="tab-list">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="tab-item"
        :class="{ active: currentPath === tab.path }"
        @click="handleTabClick(tab)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <span class="tab-close" @click.stop="handleCloseTab(tab)">×</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabNav, type TabItem } from '../hooks/useTabNav'
import { useMicroApps } from '../hooks/useMicroApps'
import { useRouteCache } from '../hooks/useRouteCache'

const { currentRouteMicroApp, getMicroAppByPath } = useMicroApps()
const router = useRouter()
const route = useRoute()
const { tabs: fullTabs, closeTab } = useTabNav()
const { clearCachePaths } = useRouteCache()

const currentPath = computed(() => route.path)
const tabs = computed(() =>
  fullTabs.value.filter(
    (tab) => tab.microAppName === currentRouteMicroApp.value?.name
  )
)

// 处理页签点击
const handleTabClick = (tab: TabItem) => {
  router.push(tab.path)
}

// 处理关闭页签
const handleCloseTab = (tab: TabItem) => {
  closeTab(tab.key)
  // 如果关闭的是当前页签，跳转到最后一个页签
  if (tab.path === currentPath.value) {
    const lastTab = tabs.value[tabs.value.length - 1]
    if (lastTab) {
      router.push(lastTab.path)
    }
  }

  if (tabs.value.length === 0) {
    const microApp = getMicroAppByPath(tab.path)
    microApp && clearCachePaths(new RegExp(microApp.activeRule))
  }
}
</script>

<style scoped>
.tab-nav {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.tab-list {
  display: flex;
  height: 40px;
  align-items: center;
  gap: 4px;
}

.tab-item {
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item:hover {
  background: #e4e7ed;
}

.tab-item.active {
  background: #409eff;
  color: #fff;
}

.tab-title {
  margin-right: 8px;
}

.tab-close {
  font-size: 16px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
}

.tab-close:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
