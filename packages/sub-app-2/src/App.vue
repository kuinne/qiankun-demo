<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { globalState, setGlobalState } from './main'

const router = useRouter()
const count = ref(0)
</script>

<template>
  <div class="sub-app-2">
    <header>
      <h1>子应用2</h1>
      <nav>
        <router-link to="/">首页</router-link> |
        <router-link to="/about">关于</router-link> |
        <router-link to="/user">用户</router-link>
      </nav>
    </header>

    <main>
      <div class="card">
        <button @click="count++">计数器: {{ count }}</button>
        <p>
          当前全局状态:
          <pre>{{ globalState }}</pre>
        </p>
        <button @click="setGlobalState && setGlobalState({ from: 'sub-app-2', message: '来自子应用2的消息', timestamp: Date.now() })">
          发送全局消息
        </button>
      </div>

      <router-view />
    </main>
  </div>
</template>

<!-- <style scoped>
 
.sub-app-2 {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

header {
  margin-bottom: 2rem;
}

nav {
  margin-top: 1rem;
}

nav a {
  margin: 0 0.5rem;
}

nav a.router-link-active {
  color: green;
  font-weight: bold;
}

.card {
  margin-bottom: 2rem;
}

pre {
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 8px;
  color: #333;
  text-align: left;
  overflow: auto;
}
</style>  -->


<style>
pre {
  background-color: #fff;
}
</style>