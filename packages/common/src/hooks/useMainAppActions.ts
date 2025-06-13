// 主应用通信

import { reactive, ref } from "vue";

type MainAppState = {
  message: string;
  from: string;
  timestamp: number;
};

type MainAppActions = {
  sendStateToMainApp: (state: any) => void;
  navigateToByMainApp: (
    path: string,
    options?: {
      // 强制刷新
      forceRefresh?: boolean;
    }
  ) => void;
};

const mainAppState = ref<MainAppState>({
  message: "",
  from: "",
  timestamp: 0,
});

const mainAppActions = reactive<MainAppActions>({
  sendStateToMainApp: (state: any) => {},
  navigateToByMainApp: (path: string) => {},
});

export const useMainAppActions = () => {
  const init = (props: {
    onGlobalStateChange: any;
    setGlobalState: any;
    initialState: any;
    navigateTo: (path: string) => void;
  }) => {
    const { onGlobalStateChange, setGlobalState, initialState, navigateTo } =
      props;
    mainAppState.value = initialState;
    mainAppActions.sendStateToMainApp = setGlobalState;
    mainAppActions.navigateToByMainApp = navigateTo;
    // 监听全局状态变化
    onGlobalStateChange?.(
      (state: Record<string, any>, prev: Record<string, any>) => {
        console.log("子应用1 - 全局状态变更：", state, prev);
        // 更新响应式对象
        Object.keys(state).forEach((key) => {
          // @ts-ignore
          mainAppState.value[key] = state[key];
        });
      }
    );
  };

  return {
    init,
    mainAppState,
    mainAppActions,
  };
};
