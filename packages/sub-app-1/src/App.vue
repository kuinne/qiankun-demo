<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { setGlobalState, globalState } from './main'

const message = ref('')
const receivedMsg = ref('')
const route = useRoute()

// 发送消息到主应用
const sendMessageToMain = () => {
  if (setGlobalState) {
    setGlobalState({
      message: message.value,
      from: 'sub-app-1',
      timestamp: new Date().getTime(),
    })
  }
}

// 修改主应用背景色
const changeBody = () => {
  document.body.style.backgroundColor = 'red'
}

// 监听全局状态变化
watch(
  () => globalState.message,
  (newVal, oldVal) => {
    console.log('watch globalState.message 变化:', newVal, oldVal)
    if (newVal) {
      receivedMsg.value = newVal
    }
  },
  { immediate: true }
)

// 组件挂载时
onMounted(() => {
  console.log('子应用 globalState.message:', globalState.message)
  console.log('子应用 整个 globalState:', globalState)

  // 如果已经有值，直接使用
  if (globalState.message) {
    receivedMsg.value = globalState.message
  }
})
</script>

<template>
  <div class="sub-app">
    <h2>这是子应用1</h2>

    <nav class="sub-nav">
      <router-link to="/" :class="{ active: route.path === '/' }"
        >首页</router-link
      >
      <router-link to="/about" :class="{ active: route.path === '/about' }"
        >关于</router-link
      >
      <router-link to="/user" :class="{ active: route.path === '/user' }"
        >用户</router-link
      >
    </nav>

    <div class="sub-content">
      <router-view></router-view>
    </div>

    <div class="communication-section">
      <h3>与主应用通信示例</h3>

      <div class="debug-info">
        <h4>调试信息:</h4>
        <pre>{{ JSON.stringify(globalState, null, 2) }}</pre>
      </div>

      <div class="send-message">
        <h4>发送消息到主应用：</h4>
        <input v-model="message" placeholder="输入要发送的消息" />
        <button @click="sendMessageToMain">发送</button>
      </div>

      <div class="received-message">
        <h4>接收到的主应用消息：</h4>
        <p>{{ receivedMsg }}</p>
      </div>

      <div class="test-section">
        <h4>测试修改主应用样式：</h4>
        <button @click="changeBody">修改主应用背景色</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-app {
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 2px solid #42b883;
  border-radius: 8px;
  margin-top: 20px;
}

.sub-nav {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  padding: 10px;

  border-radius: 4px;
}

.sub-nav a {
  text-decoration: none;
  color: #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.sub-nav a.active {
  background-color: #42b883;
  color: white;
}

.sub-content {
  margin: 20px 0;
  padding: 20px;

  border-radius: 4px;
  min-height: 200px;
}

.communication-section {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.debug-info {
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
  line-height: 1.4;
}

.send-message,
.received-message,
.test-section {
  margin: 15px 0;
}

input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>
