// @ts-ignore

import { createApp, reactive } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import { useMainAppActions } from "common";
let app: ReturnType<typeof createApp> | null = null;

const { init } = useMainAppActions();
// qiankun生命周期钩子 - 微应用初始化
function render(props: any = {}) {
  const { container, onGlobalStateChange, setGlobalState, initialState } =
    props;
  const rootContainer = container
    ? container.querySelector("#app")
    : document.getElementById("app");

  init({
    onGlobalStateChange,
    setGlobalState,
    initialState,
    navigateTo: router.push,
  });

  app = createApp(App);

  // 使用路由
  app.use(router);

  app.mount(rootContainer);
}

renderWithQiankun({
  bootstrap() {
    console.log("子应用2 bootstrap");
  },
  mount(props) {
    console.log("子应用2 mount", props);
    render(props);
  },
  unmount(props) {
    console.log("子应用2 unmount");
    if (app) {
      app.unmount();
      app = null;
    }
  },
  update(props) {
    console.log("子应用2 update", props);
  },
});

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
