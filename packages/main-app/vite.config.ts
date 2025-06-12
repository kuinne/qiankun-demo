import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({
      // options
    }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    Components({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
    federation({
      name: 'host',
      shared: ['vue'],
    }),
  ],
  server: {
    port: 5000,
    cors: true,
  },
  build: {
    target: 'chrome89',
  },
  preview: {
    port: 5000,
  },
})
