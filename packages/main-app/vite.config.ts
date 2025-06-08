import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

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
  ],
  server: {
    port: 5000,
    cors: true,
  },
})
