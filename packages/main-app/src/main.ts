import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { initGlobalState, loadMicroApp } from "qiankun";
import router from "./router";

// 初始化全局状态
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  message: "hello from main-app",
  from: "main-app",
  timestamp: new Date().getTime(),
});

onGlobalStateChange((value, prev) =>
  console.log("[onGlobalStateChange - master]", value, prev)
);

setGlobalState({
  message: "hello from main-app",
  from: "main-app",
  timestamp: new Date().getTime(),
});

// 创建主应用
function render() {
  const app = createApp(App);
  app.use(router);
  app.mount("#app");
}

render();

// 子应用管理
class MicroAppManager {
  private microApps: Record<string, any> = {};
  private isLoading: boolean = false;
  private isUnmounting: boolean = false;
  private containerCheckInterval: any = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private currentAppName: string | null = null;
  private pendingAppName: string | null = null;
  private pendingAppEntry: string | null = null;

  // 检查容器是否存在
  private checkContainer(): HTMLElement | null {
    const container = document.querySelector("#sub-app-viewport");
    if (!container) {
      console.warn("子应用容器 #sub-app-viewport 不存在");
    }
    return container as HTMLElement;
  }

  // 清除所有定时器
  private clearTimers() {
    if (this.containerCheckInterval) {
      clearInterval(this.containerCheckInterval);
      this.containerCheckInterval = null;
    }
  }

  // 重置状态
  private reset() {
    this.isLoading = false;
    this.isUnmounting = false;
    this.retryCount = 0;
    this.clearTimers();
  }

  // 卸载子应用
  async unmount(appName?: string): Promise<void> {
    // 如果指定了应用名称，则卸载指定的应用
    // 否则卸载当前应用
    const targetAppName = appName || this.currentAppName;
    if (!targetAppName || !this.microApps[targetAppName])
      return Promise.resolve();
    if (this.isUnmounting) return Promise.resolve();

    this.isUnmounting = true;
    this.clearTimers();

    try {
      console.log(`开始卸载子应用 ${targetAppName}...`);
      await this.microApps[targetAppName].unmount();
      console.log(`子应用 ${targetAppName} 已成功卸载`);
      delete this.microApps[targetAppName];
      if (this.currentAppName === targetAppName) {
        this.currentAppName = null;
      }
      this.reset();

      // 如果有待处理的应用，立即加载
      if (this.pendingAppName && this.pendingAppEntry) {
        const appName = this.pendingAppName;
        const entry = this.pendingAppEntry;
        this.pendingAppName = null;
        this.pendingAppEntry = null;
        await this.mount(appName, entry);
      }

      return Promise.resolve();
    } catch (error) {
      console.error(`子应用 ${targetAppName} 卸载失败:`, error);
      this.reset();
      return Promise.reject(error);
    }
  }

  // 加载子应用
  async mount(appName: string, entry: string): Promise<void> {
    console.log(`准备加载子应用 ${appName}...`);

    // 如果正在加载或卸载，设置为待处理状态
    if (this.isLoading || this.isUnmounting) {
      console.log(`子应用正在加载或卸载中，将 ${appName} 设置为待处理状态`);
      this.pendingAppName = appName;
      this.pendingAppEntry = entry;
      return;
    }

    // 如果已经加载了相同的应用，不需要重新加载
    if (this.currentAppName === appName && this.microApps[appName]) {
      console.log(`子应用 ${appName} 已经加载，无需重新加载`);
      return;
    }

    this.isLoading = true;
    this.clearTimers();

    // 检查容器是否存在
    const container = this.checkContainer();
    if (!container) {
      console.log("容器不存在，启动定时检查...");

      // 如果容器不存在，设置定时器检查
      return new Promise((resolve) => {
        this.containerCheckInterval = setInterval(() => {
          const container = this.checkContainer();
          if (container) {
            clearInterval(this.containerCheckInterval);
            this.containerCheckInterval = null;
            this.isLoading = false;
            this.mount(appName, entry).then(resolve);
          } else {
            this.retryCount++;
            if (this.retryCount >= this.maxRetries) {
              console.error(
                `容器检查超过最大重试次数(${this.maxRetries})，放弃加载`
              );
              clearInterval(this.containerCheckInterval);
              this.containerCheckInterval = null;
              this.isLoading = false;
              resolve();
            }
          }
        }, 300);
      });
    }

    // 如果有当前运行的子应用，先卸载
    if (this.currentAppName && this.microApps[this.currentAppName]) {
      try {
        console.log(
          `准备卸载当前子应用 ${this.currentAppName} 以加载新子应用 ${appName}`
        );
        this.pendingAppName = appName;
        this.pendingAppEntry = entry;
        await this.unmount(this.currentAppName);
        return; // 卸载完成后会自动加载待处理的应用
      } catch (error) {
        console.error(`卸载现有子应用 ${this.currentAppName} 失败:`, error);
        this.isLoading = false;
        this.pendingAppName = null;
        this.pendingAppEntry = null;
        return;
      }
    }

    try {
      console.log(`开始加载子应用 ${appName}...`);
      this.microApps[appName] = loadMicroApp({
        name: appName,
        entry: entry,
        container: "#sub-app-viewport",
        props: {
          initialState: {
            message: "hello from main-app",
            from: "main-app",
            timestamp: new Date().getTime(),
          },
          onGlobalStateChange,
          setGlobalState,
        },
      });

      await this.microApps[appName].mountPromise;
      this.currentAppName = appName;
      console.log(`子应用 ${appName} 加载成功`);
      this.isLoading = false;
    } catch (error) {
      console.error(`加载子应用 ${appName} 时发生错误:`, error);
      this.reset();
    }
  }

  // 获取子应用实例
  getMicroApp(appName: string) {
    return this.microApps[appName];
  }

  // 是否有指定子应用
  hasMicroApp(appName: string) {
    return !!this.microApps[appName];
  }

  // 获取当前子应用名称
  getCurrentAppName() {
    return this.currentAppName;
  }
}

// 创建子应用管理器实例
const microAppManager = new MicroAppManager();

// 监听容器准备好的事件
window.addEventListener("container-ready", async (event: any) => {
  console.log("收到容器准备好的事件:", event.detail);
  if (event.detail.id === "sub-app-viewport") {
    // 根据当前路由决定加载哪个子应用
    const currentPath = event.detail.path || router.currentRoute.value.path;
    console.log(`容器准备好，准备加载子应用，当前路径: ${currentPath}`);

    // 如果当前已有子应用在运行，且与目标路径不匹配，先卸载
    const currentAppName = microAppManager.getCurrentAppName();
    if (currentAppName) {
      if (
        (currentAppName === "sub-app-1" &&
          !currentPath.startsWith("/sub-app-1")) ||
        (currentAppName === "sub-app-2" &&
          !currentPath.startsWith("/sub-app-2"))
      ) {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 不匹配，准备卸载`
        );
        await microAppManager.unmount(currentAppName);
      } else if (
        (currentAppName === "sub-app-1" &&
          currentPath.startsWith("/sub-app-1")) ||
        (currentAppName === "sub-app-2" && currentPath.startsWith("/sub-app-2"))
      ) {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 匹配，无需重新加载`
        );
        return;
      }
    }

    // 根据路径加载相应的子应用
    if (currentPath.startsWith("/sub-app-1")) {
      console.log("准备加载子应用1");
      await microAppManager.mount("sub-app-1", "//localhost:5001");
    } else if (currentPath.startsWith("/sub-app-2")) {
      console.log("准备加载子应用2");
      await microAppManager.mount("sub-app-2", "//localhost:5002");
    }
  }
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log(`路由守卫 - 路由变化: 从 ${from.path} 到 ${to.path}`);
  try {
    const currentAppName = microAppManager.getCurrentAppName();

    // 如果要去子应用路由
    if (to.path.startsWith("/sub-app-1") || to.path.startsWith("/sub-app-2")) {
      // 如果从主应用来，或者从不同的子应用来，需要确保先卸载当前子应用
      if (
        (!from.path.startsWith("/sub-app-1") &&
          !from.path.startsWith("/sub-app-2")) ||
        (currentAppName &&
          ((currentAppName === "sub-app-1" &&
            !to.path.startsWith("/sub-app-1")) ||
            (currentAppName === "sub-app-2" &&
              !to.path.startsWith("/sub-app-2"))))
      ) {
        console.log("从主应用或其他子应用切换，需要卸载当前子应用");
        if (currentAppName) {
          await microAppManager.unmount(currentAppName);
        }
      }
    } else {
      // 如果要去主应用路由，卸载当前子应用
      if (currentAppName) {
        console.log("切换到主应用，卸载当前子应用");
        await microAppManager.unmount(currentAppName);
      }
    }
    next();
  } catch (error) {
    console.error("路由守卫中发生错误:", error);
    next();
  }
});
