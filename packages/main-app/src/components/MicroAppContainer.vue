<template>
  <div class="micro-app-container">
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
  .micro-app-container-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
