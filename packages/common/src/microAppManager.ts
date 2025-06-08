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
  /** 容器检查定时器 */
  private containerCheckInterval: number | null = null
  /** 重试次数 */
  private retryCount: number = 0
  /** 最大重试次数 */
  private maxRetries: number = 3
  /** 当前子应用名称 */
  private currentAppName: string | null = null
  /** 待处理的子应用名称 */
  private pendingAppName: string | null = null
  /** 待处理的子应用入口 */
  private pendingAppEntry: string | null = null

  constructor() {}

  /**
   * 检查容器是否存在
   * @param containerId 容器ID
   * @returns 容器元素或null
   */
  private checkContainer(containerId: string): HTMLElement | null {
    const container = document.querySelector(containerId)
    if (!container) {
      console.warn(`子应用容器 ${containerId} 不存在`)
    }
    return container as HTMLElement
  }

  /**
   * 清除所有定时器
   */
  private clearTimers() {
    if (this.containerCheckInterval) {
      clearInterval(this.containerCheckInterval)
      this.containerCheckInterval = null
    }
  }

  /**
   * 重置状态
   */
  private reset() {
    this.isLoading = false
    this.isUnmounting = false
    this.retryCount = 0
    this.clearTimers()
  }

  /**
   * 卸载子应用
   * @param appName 应用名称（可选，默认卸载当前应用）
   * @returns Promise
   */
  async unmount(appName?: string): Promise<void> {
    // 如果指定了应用名称，则卸载指定的应用
    // 否则卸载当前应用
    const targetAppName = appName || this.currentAppName
    if (!targetAppName || !this.microApps[targetAppName])
      return Promise.resolve()
    if (this.isUnmounting) return Promise.resolve()

    this.isUnmounting = true
    this.clearTimers()

    try {
      console.log(`开始卸载子应用 ${targetAppName}...`)
      await this.microApps[targetAppName].unmount()
      console.log(`子应用 ${targetAppName} 已成功卸载`)
      delete this.microApps[targetAppName]
      if (this.currentAppName === targetAppName) {
        this.currentAppName = null
      }
      this.reset()

      // 如果有待处理的应用，立即加载
      if (this.pendingAppName && this.pendingAppEntry) {
        const appName = this.pendingAppName
        const entry = this.pendingAppEntry
        this.pendingAppName = null
        this.pendingAppEntry = null
        await this.mount(appName, entry)
      }

      return Promise.resolve()
    } catch (error) {
      console.error(`子应用 ${targetAppName} 卸载失败:`, error)
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
    container: string = '#sub-app-viewport'
  ): Promise<void> {
    console.log(`准备加载子应用 ${appName}...`)

    // 如果正在加载或卸载，设置为待处理状态
    if (this.isLoading || this.isUnmounting) {
      console.log(`子应用正在加载或卸载中，将 ${appName} 设置为待处理状态`)
      this.pendingAppName = appName
      this.pendingAppEntry = entry
      return
    }

    // 如果已经加载了相同的应用，不需要重新加载
    if (this.currentAppName === appName && this.microApps[appName]) {
      console.log(`子应用 ${appName} 已经加载，无需重新加载`)
      return
    }

    this.isLoading = true
    this.clearTimers()

    // 检查容器是否存在
    const containerEl = this.checkContainer(container)
    if (!containerEl) {
      console.log('容器不存在，启动定时检查...')

      // 如果容器不存在，设置定时器检查
      return new Promise((resolve) => {
        this.containerCheckInterval = setInterval(() => {
          const containerEl = this.checkContainer(container)
          if (containerEl) {
            clearInterval(this.containerCheckInterval!)
            this.containerCheckInterval = null
            this.isLoading = false
            this.mount(appName, entry, container).then(resolve)
          } else {
            this.retryCount++
            if (this.retryCount >= this.maxRetries) {
              console.error(
                `容器检查超过最大重试次数(${this.maxRetries})，放弃加载`
              )
              clearInterval(this.containerCheckInterval!)
              this.containerCheckInterval = null
              this.isLoading = false
              resolve()
            }
          }
        }, 300)
      })
    }

    // 如果有当前运行的子应用，先卸载
    if (this.currentAppName && this.microApps[this.currentAppName]) {
      try {
        console.log(
          `准备卸载当前子应用 ${this.currentAppName} 以加载新子应用 ${appName}`
        )
        this.pendingAppName = appName
        this.pendingAppEntry = entry
        await this.unmount(this.currentAppName)
        return // 卸载完成后会自动加载待处理的应用
      } catch (error) {
        console.error(`卸载现有子应用 ${this.currentAppName} 失败:`, error)
        this.isLoading = false
        this.pendingAppName = null
        this.pendingAppEntry = null
        return
      }
    }

    try {
      console.log(`开始加载子应用 ${appName}...`)

      this.microApps[appName] = loadMicroApp(
        {
          name: appName,
          entry: entry,
          container: container,
          props: {
            initialState: {
              message: 'hello from main-app',
              from: 'main-app',
              timestamp: new Date().getTime(),
            },
          },
        },
        {
          sandbox: {
            experimentalStyleIsolation: true,
          },
        }
      )

      await this.microApps[appName].mountPromise
      this.currentAppName = appName
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

  /**
   * 获取当前子应用名称
   * @returns 当前子应用名称
   */
  getCurrentAppName(): string | null {
    return this.currentAppName
  }
}
