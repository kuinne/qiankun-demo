import { defineConfig, type UserConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
// @ts-ignore
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
  return defineConfig(({ command }) => {
    const postcssPlugins: any[] = []
    if (microAppName && command === 'serve') {
      postcssPlugins.push(
        postcssPluginNameSpace(`div[data-qiankun="${microAppName}"]`, {
          ignore: [/el-/, ':root'],
        })
      )
    }
    const baseConfig: UserConfig = {
      base:
        command === 'serve'
          ? '/'
          : `http://localhost:${viteConfig?.server?.port || 5000}/`,
      plugins: [
        vue(),
        microAppName
          ? qiankun(microAppName, {
              useDevMode: command === 'serve', // 开发模式启用特殊配置
            })
          : null,

        ElementPlus({
          // options
        }),
      ],
      css: {
        postcss: {
          plugins: postcssPlugins,
        },
      },
      server: {
        cors: true,
      },
      build: {
        target: 'chrome89',
      },
    }

    return mergeConfig(baseConfig, viteConfig || {})
  })
}
