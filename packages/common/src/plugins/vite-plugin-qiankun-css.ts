import type { Plugin } from 'vite'
import type { Root, Rule } from 'postcss'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

// 生成 Qiankun 样式隔离前缀
const generateScope = (appName: string) => `[data-qiankun="${appName}"]`

// 处理 CSS 选择器
const processRule = (rule: Rule, scope: string) => {
  if (rule.selector.startsWith('[data]')) return
  const newSelector = selectorParser((selectors) => {
    selectors.walk((selector) => {
      if (selector.type === 'selector') {
        let hasInserted = false
        const nodes: selectorParser.Node[] = []

        selector.each((node) => {
          if (!hasInserted) {
            // 创建属性选择器节点
            const attrNode = selectorParser.attribute({
              attribute: 'href',
              raws: {},
              value: '',
            })

            nodes.push(attrNode)
            hasInserted = true
          }
          nodes.push(node.clone())
        })

        // selector.nodes = nodes
      }
    })
  }).processSync(rule.selector)
  console.log('newSelector11', newSelector)
  rule.selector = newSelector
}

export default (appName: string): Plugin => {
  const scope = generateScope(appName)

  return {
    name: 'vite-plugin-qiankun-css',
    enforce: 'pre',

    transform(code, id, options) {
      if (!/\.(css|scss|sass|less|styl)$/.test(id)) return

      try {
        const result = postcss([
          {
            postcssPlugin: 'qiankun-scope-plugin',
            Rule(rule) {
              // console.log('rule', rule)
              processRule(rule, scope)
            },
          },
        ]).process(code, {
          from: id,
          to: id,
          map: false,
        })
        console.log('result.css', result.css)

        return {
          code: result.css,
        }
      } catch (error) {
        console.error(
          `[vite-plugin-qiankun-css] Error processing ${id}:`,
          error
        )
        return null
      }
    },
  }
}
