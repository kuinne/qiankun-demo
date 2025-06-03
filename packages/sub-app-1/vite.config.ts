import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    qiankun('sub-app-1', {
      useDevMode: true, // 开发模式启用特殊配置
    }),
  ],
  server: {
    port: 5001,
    cors: true,
  },
})
