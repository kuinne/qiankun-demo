import type { MicroApp } from 'qiankun'

/**
 * 子应用配置接口
 */
export interface MenuItem {
  title: string
  path: string
  icon?: string
}

export interface MicroAppConfig {
  /** 子应用名称 */
  name: string
  /** 子应用入口 */
  entry: string
  /** 子应用激活规则（路径前缀） */
  activeRule: string
  /** 子应用默认路径 */
  defaultPath: string
  /** 子应用标题 */
  title: string
  /** 子应用菜单 */
  menus: MenuItem[]
}

/**
 * 全局状态更新回调函数
 */
export type OnGlobalStateChangeCallback = (
  state: Record<string, any>,
  prev: Record<string, any>
) => void

/**
 * 设置全局状态的函数
 */
export type SetGlobalStateFunction = (state: Record<string, any>) => void
