# Qiankun 微前端 Demo

基于 qiankun 搭建的微前端 Demo，使用 Vite + Vue3 + TypeScript，采用 monorepo 结构。

## 项目结构

```
qiankun-demo/
├── packages/
│   ├── main-app/       # 主应用
│   └── sub-app-1/      # 子应用1
├── package.json        # 工作空间配置
└── pnpm-workspace.yaml # pnpm 工作空间配置
```

## 技术栈

- 微前端框架：qiankun
- 构建工具：Vite
- 前端框架：Vue 3
- 开发语言：TypeScript
- 包管理工具：pnpm

## 安装依赖

```bash
# 安装所有工作空间依赖
pnpm install
```

## 开发运行

```bash
# 同时启动主应用和子应用
pnpm dev

# 或者分别启动
cd packages/main-app
pnpm dev

cd packages/sub-app-1
pnpm dev
```

## 构建

```bash
# 构建所有应用
pnpm build

# 或者分别构建
cd packages/main-app
pnpm build

cd packages/sub-app-1
pnpm build
```

## 访问地址

- 主应用：http://localhost:5000
- 子应用1：http://localhost:5001

## 注意事项

1. 主应用通过 `/sub-app-1` 路由加载子应用
2. 子应用可以独立运行，也可以被主应用加载运行 