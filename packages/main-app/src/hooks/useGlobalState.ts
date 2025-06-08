import { initGlobalState } from 'qiankun'
import type {
  OnGlobalStateChangeCallback,
  SetGlobalStateFunction,
} from 'common'

export interface GlobalState {
  message: string
  from: string
  timestamp: number
  [key: string]: any
}

export const useGlobalState = () => {
  // 默认全局状态
  const defaultState: GlobalState = {
    message: 'hello from main-app',
    from: 'main-app',
    timestamp: new Date().getTime(),
  }

  // 初始化全局状态
  const { onGlobalStateChange, setGlobalState } = initGlobalState(defaultState)

  // 监听全局状态变化
  const addGlobalStateChangeListener = (
    callback: OnGlobalStateChangeCallback
  ) => {
    return onGlobalStateChange(callback)
  }

  // 默认的全局状态变化监听
  addGlobalStateChangeListener((value, prev) =>
    console.log('[onGlobalStateChange - master]', value, prev)
  )

  // 设置全局状态
  const updateGlobalState = (state: Partial<GlobalState>) => {
    setGlobalState(state)
  }

  return {
    defaultState,
    updateGlobalState,
    addGlobalStateChangeListener,
  }
}
