import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { registerMicroApps, start } from "qiankun";

// 创建主应用
const app = createApp(App);
app.mount("#app");

// 注册微应用
registerMicroApps([
  {
    name: "sub-app-1",
    entry: "//localhost:5001",
    container: "#sub-app-container",
    activeRule: "/sub-app-1",
  },
]);

// 启动 qiankun
start();
