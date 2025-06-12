import { loadMicroApp } from 'qiankun'
import type { MicroApp } from 'qiankun'

/**
 * 子应用管理器类
 */
export class MicroAppManager {
  /** 子应用实例映射 */
  private microApps: Record<string, MicroApp> = {}
  /** 是否正在加载 */
  private isLoading: boolean = false
  /** 是否正在卸载 */
  private isUnmounting: boolean = false

  constructor() {}

  /**
   * 重置状态
   */
  private reset() {
    this.isLoading = false
    this.isUnmounting = false
  }

  /**
   * 卸载子应用
   * @param appName 应用名称（可选，默认卸载当前应用）
   * @returns Promise
   */
  async unmount(appName: string): Promise<void> {
    // 如果指定了应用名称，则卸载指定的应用
    if (!this.microApps[appName]) return Promise.resolve()

    if (this.isUnmounting) return Promise.resolve()

    this.isUnmounting = true

    try {
      console.log(`开始卸载子应用 ${appName}...`)
      await this.microApps[appName].unmount()
      console.log(`子应用 ${appName} 已成功卸载`)
      delete this.microApps[appName]
      this.reset()

      return Promise.resolve()
    } catch (error) {
      console.error(`子应用 ${appName} 卸载失败:`, error)
      this.reset()
      return Promise.reject(error)
    }
  }

  /**
   * 加载子应用
   * @param appName 应用名称
   * @param entry 应用入口
   * @param container 容器选择器（默认为#sub-app-viewport）
   * @returns Promise
   */
  async mount(
    appName: string,
    entry: string,
    container: string = '#sub-app-viewport',
    initialState: any
  ): Promise<void> {
    // 如果正在加载或卸载，设置为待处理状态
    // if (this.isLoading || this.isUnmounting) {
    //   return
    // }

    // 如果已经加载了相同的应用，不需要重新加载
    if (this.microApps[appName]) {
      console.log(`子应用 ${appName} 已经加载，无需重新加载`)
      return
    }

    this.isLoading = true
    try {
      console.log(`开始加载子应用 ${appName}...`)

      this.microApps[appName] = loadMicroApp(
        {
          name: appName,
          entry: entry,
          container: container,
          props: {
            initialState,
          },
        },
        {
          sandbox: {
            experimentalStyleIsolation: true,
          },
        }
      )

      await this.microApps[appName].mountPromise

      console.log(`子应用 ${appName} 加载成功`)
      this.isLoading = false
    } catch (error) {
      console.error(`加载子应用 ${appName} 时发生错误:`, error)
      this.reset()
    }
  }

  /**
   * 获取子应用实例
   * @param appName 应用名称
   * @returns 子应用实例
   */
  getMicroApp(appName: string): MicroApp | undefined {
    return this.microApps[appName]
  }

  /**
   * 是否有指定子应用
   * @param appName 应用名称
   * @returns 是否存在
   */
  hasMicroApp(appName: string): boolean {
    return !!this.microApps[appName]
  }
}
