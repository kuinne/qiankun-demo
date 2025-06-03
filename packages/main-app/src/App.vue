<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
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
          to="/sub-app-1"
          :class="{ active: route?.path.startsWith('/sub-app-1') }"
          >子应用1</router-link
        >
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
