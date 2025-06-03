import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5001,
    cors: true,
    origin: "http://localhost:5001",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  base: "/",
  // 配置qiankun所需的输出格式
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue"],
        },
      },
    },
  },
});
