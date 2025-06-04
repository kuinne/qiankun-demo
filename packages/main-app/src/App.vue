<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed } from "vue";

const route = useRoute();

// 子应用配置列表，与main.ts中保持一致
const microApps = [
  {
    name: "sub-app-1",
    entry: "//localhost:5001",
    activeRule: "/sub-app/sub-app-1",
    container: "#sub-app-viewport",
    defaultPath: "/sub-app/sub-app-1",
    title: "子应用1",
  },
  {
    name: "sub-app-2",
    entry: "//localhost:5002",
    activeRule: "/sub-app/sub-app-2",
    container: "#sub-app-viewport",
    defaultPath: "/sub-app/sub-app-2",
    title: "子应用2",
  },
];

// 判断当前路径是否属于某个子应用
const isActiveApp = (appActiveRule: string) => {
  return route?.path.startsWith(appActiveRule);
};
</script>

<template>
  <div class="main-app">
    <header class="header">
      <h1>微前端 Qiankun Demo</h1>
      <div class="nav">
        <router-link to="/" :class="{ active: route?.path === '/' }"
          >主应用</router-link
        >
        <router-link
          v-for="app in microApps"
          :key="app.name"
          :to="app.defaultPath"
          :class="{ active: isActiveApp(app.activeRule) }"
        >
          {{ app.title }}
        </router-link>
      </div>
    </header>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.main-app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.nav {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.nav a {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
}

.nav a.active {
  background-color: #42b883;
  color: white;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.content {
  margin-top: 30px;
  min-height: 400px;
}
</style>
