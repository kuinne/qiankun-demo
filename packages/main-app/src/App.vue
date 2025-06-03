<script setup lang="ts">
import { ref } from "vue";

const currentApp = ref("main");
</script>

<template>
  <div class="main-app">
    <header class="header">
      <h1>微前端 Qiankun Demo</h1>
      <div class="nav">
        <a
          @click="currentApp = 'main'"
          :class="{ active: currentApp === 'main' }"
          >主应用</a
        >
        <a
          href="/sub-app-1"
          @click="currentApp = 'sub-app-1'"
          :class="{ active: currentApp === 'sub-app-1' }"
          >子应用1</a
        >
      </div>
    </header>

    <div class="content">
      <div v-show="currentApp === 'main'" class="main-content">
        <h2>这是主应用内容</h2>
        <div class="logo-container">
          <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
          </a>
        </div>
      </div>

      <!-- 子应用容器 -->
      <div id="sub-app-container"></div>
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
}
</style>
