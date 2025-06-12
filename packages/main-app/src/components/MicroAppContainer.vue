<template>
  <div class="micro-app-container">
    <div v-if="!microApp.isMounted" class="loading-container">
      <el-skeleton :rows="6" animated />
      <div class="loading-text">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>正在加载应用，请稍候...</span>
      </div>
    </div>
    <div
      :id="containerId"
      class="micro-app-container-content"
      ref="containerRef"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useMicroApps, MicroApp } from '../hooks/useMicroApps'
import { ref, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps<{
  containerId: string
  microApp: MicroApp
}>()

const containerRef = ref<HTMLElement | null>(null)

const { mountMicroApp } = useMicroApps()

watch(containerRef, () => {
  if (containerRef.value) {
    mountMicroApp(props.microApp, `#${props.containerId}`)
  }
})
</script>

<style scoped>
.micro-app-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.micro-app-container-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.loading-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.loading-text {
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.loading-icon {
  margin-right: 8px;
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
