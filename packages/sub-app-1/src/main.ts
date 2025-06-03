// @ts-ignore
import "./public-path.js";
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

let app: ReturnType<typeof createApp> | null = null;

// qiankun生命周期钩子 - 微应用初始化
function render(props: any = {}) {
  const { container } = props;
  const rootContainer = container
    ? container.querySelector("#app")
    : document.getElementById("app");

  app = createApp(App);
  app.mount(rootContainer);
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

// qiankun生命周期钩子 - 微应用挂载前
export async function bootstrap() {
  console.log("子应用1 bootstrap");
}

// qiankun生命周期钩子 - 微应用挂载后
export async function mount(props: any) {
  console.log("子应用1 mount", props);
  render(props);
}

// qiankun生命周期钩子 - 微应用卸载后
export async function unmount() {
  console.log("子应用1 unmount");
  if (app) {
    app.unmount();
    app = null;
  }
}
