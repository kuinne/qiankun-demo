<template>
  <el-container class="layout-container">
    <el-header height="60px">
      <div class="header-content">
        <div class="logo">主应用</div>
        <el-menu mode="horizontal" :router="true" class="main-menu">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item
            v-for="app in microApps"
            :key="app.name"
            :index="app.defaultPath"
            :class="{ 'is-active': isActiveApp(app.activeRule) }"
          >
            {{ app.title }}
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-container class="main-container">
      <el-aside width="200px">
        <template v-if="currentApp">
          <el-menu router class="sub-menu" :default-active="route.path">
            <el-menu-item
              v-for="item of currentApp.menus"
              :key="item.path"
              :index="item.path"
            >
              <el-icon>
                <component :is="item.icon || 'Document'"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </el-menu>
        </template>
      </el-aside>

      <el-main class="app-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  ElMenu,
  ElIcon,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
} from 'element-plus'
import { useMicroApps } from '../hooks/useMicroApps'
import { useRoute } from 'vue-router'

const route = useRoute()
const { microApps, isActiveApp, currentApp } = useMicroApps()
</script>

<style scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
}

.main-menu {
  flex: 1;
  border-bottom: none;
}

.sub-menu {
  height: 100%;
  border-right: 1px solid #dcdfe6;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
  flex-shrink: 0;
}

.el-aside {
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}

.app-container {
  background-color: #f5f7fa;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

:deep(.is-active) {
  color: var(--el-menu-active-color) !important;
  background-color: var(--el-menu-hover-bg-color) !important;
}
</style>
