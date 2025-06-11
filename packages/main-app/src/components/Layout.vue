<template>
  <el-container class="layout-container">
    <el-header height="60px" class="main-header">
      <div class="header-content">
        <div class="logo">主应用</div>
        <el-menu mode="horizontal" class="main-menu">
          <el-menu-item index="/" @click="handleRouteJump('/')"
            >首页</el-menu-item
          >
          <el-menu-item
            v-for="app in microApps"
            :key="app.name"
            :class="{ 'is-active': currentMicroAppConfig?.name === app.name }"
            @click="handleOpenMicroApp(app)"
          >
            {{ app.title }}
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-container class="main-container">
      <el-aside width="200px" class="main-aside" v-if="currentMicroAppConfig">
        <el-menu
          router
          class="sub-menu"
          :default-active="route.path"
          background-color="#fff"
          text-color="#303133"
          active-text-color="#409EFF"
        >
          <el-menu-item
            v-for="menu in currentMicroAppConfig.menus"
            :key="menu.path"
            :index="menu.path"
          >
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main-content">
        <TabNav />
        <div class="page-container">
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="cacheKeys">
              <component :is="Component" :key="route.meta.cacheKey" />
            </keep-alive>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabNav from './TabNav.vue'
import { useMicroApps } from '../hooks/useMicroApps'
import { useCacheKeys } from '../hooks/useCacheKeys'
import type { MicroAppConfig } from 'common'
import { h } from 'vue'
import MicroAppContainer from './MicroAppContainer.vue'
import { defineComponent } from 'vue'

const route = useRoute()

const router = useRouter()
const { microApps, getMicroAppConfigByPath, getMicroAppDefaultPath } =
  useMicroApps()

const { addCacheKey, cacheKeys } = useCacheKeys()

const currentMicroAppConfig = computed(() =>
  getMicroAppConfigByPath(route.path)
)

const handleRouteJump = (path: string) => {
  router.push(path)
}

const handleOpenMicroApp = (microAppConfig: MicroAppConfig) => {
  if (!router.hasRoute(microAppConfig.name)) {
    router.addRoute({
      path: `${microAppConfig.activeRule}:pathMatch(.*)`,
      name: microAppConfig.name,
      props: {
        microAppConfig,
        containerId: `${microAppConfig.name}-${Date.now()}`,
      },
      meta: {
        cacheKey: microAppConfig.name,
      },
      component: defineComponent({
        name: microAppConfig.name,
        render() {
          return h(MicroAppContainer, {
            microAppConfig,
            containerId: `${microAppConfig.name}-${Date.now()}`,
          })
        },
      }),
    })

    addCacheKey(microAppConfig.name)
  }

  router.push(
    getMicroAppDefaultPath(microAppConfig.name) || microAppConfig.defaultPath
  )
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.main-header {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-right: 40px;
  white-space: nowrap;
}

.main-menu {
  flex: 1;
  border-bottom: none;
  min-width: 0;
}

.main-container {
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.main-aside {
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  box-shadow: 1px 0 4px rgba(0, 21, 41, 0.08);
}

.sub-menu {
  height: 100%;
  border-right: none;
}

.main-content {
  height: 100%;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}

.page-container {
  flex: 1;
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sub-app-viewport {
  flex: 1;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

:deep(.el-container) {
  width: 100%;
  height: 100%;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
  width: 100%;
}

:deep(.el-menu-item.is-active) {
  border-bottom: 2px solid var(--el-menu-active-color);
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.el-menu-item.is-active:hover) {
  background-color: #ecf5ff;
}
</style>
