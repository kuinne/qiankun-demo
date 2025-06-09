<template>
  <div class="sub-app-container">
    <div v-if="loading" class="loading">正在加载子应用...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div id="sub-app-viewport" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isSubAppRoute, extractSubAppName } from 'common'
import { useMicroApps } from '../hooks/useMicroApps'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const containerRef = ref<HTMLElement | null>(null)
const lastNotifiedPath = ref('')

const { mountMicroApp } = useMicroApps()

// 通知主应用容器已准备好并加载子应用
const loadMicroApp = () => {
  // 避免重复通知相同路径
  if (lastNotifiedPath.value === route.path) return

  lastNotifiedPath.value = route.path
  loading.value = false
  mountMicroApp()
}

// 监听路由变化
watch(
  () => route.path,
  (newPath, oldPath = '') => {
    console.log(`子应用容器内路由变化: 从 ${oldPath} 到 ${newPath}`)

    if (newPath === oldPath) return

    // 如果是切换到不同的子应用，重新加载
    if (isSubAppRoute(newPath)) {
      const oldAppName = extractSubAppName(oldPath)
      const newAppName = extractSubAppName(newPath)

      if (!oldAppName || oldAppName !== newAppName) {
        loading.value = true
        setTimeout(loadMicroApp, 50)
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  console.log('子应用容器组件已挂载')
  loading.value = true
  setTimeout(loadMicroApp, 100)
})

onUnmounted(() => {
  console.log('子应用容器组件已卸载')
  loading.value = true
  error.value = ''
  lastNotifiedPath.value = ''
})

// 处理keep-alive的情况
onActivated(() => {
  console.log('子应用容器组件已激活')
  loadMicroApp()
})
</script>

<style scoped>
.sub-app-container {
  height: 100%;
  position: relative;
  background-color: #fff;

  min-height: 300px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.error {
  color: #ff4d4f;
  padding: 20px;
  text-align: center;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  margin-bottom: 20px;
}

#sub-app-viewport {
  height: 100%;
  overflow: auto;
}
</style>
