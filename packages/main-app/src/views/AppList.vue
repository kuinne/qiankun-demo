<template>
  <div class="app-list-container">
    <el-row :gutter="20">
      <el-col
        v-for="app in microApps"
        :key="app.name"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-card class="app-card" shadow="hover" @click="handleAppClick(app)">
          <div class="app-icon">
            <el-icon :size="40" :color="'#409EFF'">
              <component :is="app.icon || 'Monitor'" />
            </el-icon>
          </div>
          <div class="app-info">
            <h3 class="app-title">{{ app.name }}</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MicroApp, useMicroApps } from '../hooks/useMicroApps'

const router = useRouter()
const { microApps } = useMicroApps()

// 处理应用点击
const handleAppClick = (app: MicroApp) => {
  router.push(app.defaultPath)
}
</script>

<style scoped>
.app-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.app-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.app-card:hover {
  transform: translateY(-5px);
}

.app-icon {
  text-align: center;
  margin-bottom: 15px;
}

.app-info {
  text-align: center;
}

.app-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.app-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
  line-height: 1.4;
}
</style>
