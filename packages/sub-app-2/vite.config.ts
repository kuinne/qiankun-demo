import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import qiankunCss from '../common/src/plugins/vite-plugin-qiankun-css'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    qiankunCss('sub-app-2'),
    qiankun('sub-app-2', {
      useDevMode: true, // 开发模式启用特殊配置
    }),
  ],
  server: {
    port: 5002,
    cors: true,
  },
})
