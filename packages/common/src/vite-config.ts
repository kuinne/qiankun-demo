import { defineConfig, UserConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import postcssPluginNameSpace from 'postcss-plugin-namespace'

import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default ({
  microAppName,
  viteConfig,
}: {
  viteConfig?: UserConfig
  microAppName?: string
}) => {
  const baseConfig: UserConfig = {
    base: '/',
    plugins: [
      vue(),
      microAppName
        ? qiankun(microAppName, {
            useDevMode: true, // 开发模式启用特殊配置
          })
        : null,

      ElementPlus({
        // options
      }),
    ],
    css: {
      postcss: {
        plugins: [
          microAppName &&
            postcssPluginNameSpace(`div[data-qiankun="${microAppName}"]`, {
              ignore: [/el-/, ':root'],
            }),
        ],
      },
    },
    server: {
      cors: true,
    },
  }
  return defineConfig(mergeConfig(baseConfig, viteConfig || {}))
}
