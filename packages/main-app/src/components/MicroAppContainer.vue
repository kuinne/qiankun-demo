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
import type { MicroAppConfig } from 'common'
import { useMicroApps } from '../hooks/useMicroApps'
import { onBeforeUnmount } from 'vue'
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { onActivated } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  containerId: string
  microAppConfig: MicroAppConfig
}>()

const containerRef = ref<HTMLElement | null>(null)

const { mountMicroApp, unmountMicroApp } = useMicroApps()

const route = useRoute()

watch(containerRef, () => {
  if (containerRef.value) {
    mountMicroApp(props.microAppConfig, `#${props.containerId}`)
  }
})

onBeforeUnmount(() => {
  //   unmountMicroApp(props.microAppConfig.name)
})

onMounted(() => {
  console.log(
    'MicroAppContainer onMounted',
    props.microAppConfig.name,
    props.containerId
  )
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
