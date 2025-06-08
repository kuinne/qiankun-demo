import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import qiankunCss from '../common/src/plugins/vite-plugin-qiankun-css'
import postcssPluginNameSpace from 'postcss-plugin-namespace'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    // qiankunCss('sub-app-1'),
    qiankun('sub-app-1', {
      useDevMode: true, // 开发模式启用特殊配置
    }),
  ],
  css: {
    postcss: {
      plugins: [postcssPluginNameSpace('div[data-qiankun="sub-app-1"]')],
    },
  },
  server: {
    port: 5001,
    cors: true,
  },
})
