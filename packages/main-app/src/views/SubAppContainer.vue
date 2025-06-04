<template>
  <div class="sub-app-container">
    <div v-if="loading" class="loading">正在加载子应用...</div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div id="sub-app-viewport" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  watch,
} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const loading = ref(true);
const error = ref("");
const containerRef = ref<HTMLElement | null>(null);
const currentPath = ref(route.path);

// 通知主应用容器已准备好
const notifyContainerReady = () => {
  console.log("通知容器准备好，当前路径:", route.path);
  window.dispatchEvent(
    new CustomEvent("container-ready", {
      detail: {
        id: "sub-app-viewport",
        timestamp: new Date().getTime(),
        path: route.path,
      },
    })
  );
};

// 监听路由变化
watch(
  () => route.path,
  (newPath, oldPath = "") => {
    console.log(`子应用容器内路由变化: 从 ${oldPath} 到 ${newPath}`);
    if (newPath !== oldPath) {
      currentPath.value = newPath;
      // 如果是在子应用之间切换
      if (
        (oldPath?.startsWith("/sub-app-1") &&
          newPath.startsWith("/sub-app-2")) ||
        (oldPath?.startsWith("/sub-app-2") && newPath.startsWith("/sub-app-1"))
      ) {
        console.log("子应用间切换，触发容器准备事件");
        // 先显示加载状态
        loading.value = true;
        // 短暂延时后触发容器准备事件
        setTimeout(() => {
          loading.value = false;
          notifyContainerReady();
        }, 50);
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("子应用容器组件已挂载");
  loading.value = true;

  // 确保容器元素已经挂载到DOM
  setTimeout(() => {
    loading.value = false;
    notifyContainerReady();
  }, 100);
});

onUnmounted(() => {
  console.log("子应用容器组件已卸载");
  loading.value = true;
  error.value = "";
});

// 处理keep-alive的情况
onActivated(() => {
  console.log("子应用容器组件已激活");
  notifyContainerReady();
});

onDeactivated(() => {
  console.log("子应用容器组件已停用");
});
</script>

<style scoped>
.sub-app-container {
  padding: 20px;
  position: relative;
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
  min-height: 300px;
}
</style>
