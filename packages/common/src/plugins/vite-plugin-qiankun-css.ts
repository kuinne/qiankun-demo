import type { Plugin } from 'vite'
import postcss from 'postcss'

// 生成 Qiankun 样式隔离前缀
const generateScope = (appName: string) => `div[data-qiankun=${appName}]`

export default (appName: string): Plugin => {
  const scopeSelector = generateScope(appName)

  return {
    name: 'vite-plugin-qiankun-css',
    enforce: 'pre',

    transform(code, id, options) {
      if (!/\.(css|scss|sass|less|styl|vue?vue&type=style)$/.test(id)) return

      try {
        const result = postcss([
          {
            postcssPlugin: 'qiankun-scope-plugin',
            Root(root, helper) {
              root.walkRules((rule) => {
                // 跳过关键帧规则
                // @ts-ignore
                if (rule.parent && rule.parent?.name === 'keyframes') return
                // 处理媒体查询内的规则
                if (
                  rule.parent?.type === 'atrule' &&
                  // @ts-ignore
                  rule.parent?.name === 'media'
                ) {
                  rule.selectors = rule.selectors.map(
                    (selector) => `${scopeSelector} ${selector}`
                  )
                }
                // 处理普通规则
                if (rule.parent?.type === 'root') {
                  rule.selectors = rule.selectors.map(
                    (selector) => `${scopeSelector} ${selector}`
                  )
                }
              })
            },
          },
        ]).process(code, {
          from: id,
          to: id,
          map: false,
        })

        return {
          code: result.css,
        }
      } catch (error) {
        console.error(
          `[vite-plugin-qiankun-css] Error processing ${id}:`
          // error
        )
        return null
      }
    },
  }
}
