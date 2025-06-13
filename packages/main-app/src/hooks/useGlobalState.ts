import { initGlobalState, type MicroAppStateActions } from "qiankun";
import type { OnGlobalStateChangeCallback } from "common";

export interface GlobalState {
  message: string;
  from: string;
  timestamp: number;
  [key: string]: any;
}

export const useGlobalState = () => {
  // 默认全局状态
  const defaultState: GlobalState = {
    message: "hello from main-app",
    from: "main-app",
    timestamp: new Date().getTime(),
  };

  // 初始化全局状态
  const actions: MicroAppStateActions = initGlobalState(defaultState);

  // 监听全局状态变化
  const addGlobalStateChangeListener = (
    callback: OnGlobalStateChangeCallback
  ) => {
    actions.onGlobalStateChange(callback);
  };

  // 设置全局状态
  const updateGlobalState = (state: Partial<GlobalState>) => {
    actions.setGlobalState(state);
  };

  return {
    defaultState,
    updateGlobalState,
    addGlobalStateChangeListener,
  };
};
