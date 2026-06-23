# CopyBox Lite

一个基于 React 18 和 Tailwind CSS 开发的 Chrome 浏览器剪贴板管理插件。支持对保存的文本/代码片段进行快速复制与拖拽重排。

## 功能特性

*   **一键复制**：点击任意保存的片段即可自动复制到系统剪贴板，方便快捷。
*   **拖拽排序**：利用 `@dnd-kit` 实现列表项的顺畅拖拽和重新排序，个性化整理常用短语或代码。
*   **持久化保存**：集成 Chrome Extension Storage API，确保您保存的片段在浏览器重启后依然保留。
*   **清爽界面**：基于 Tailwind CSS 和 Lucide Icons 构建，布局精简，无广告噪音。

## 技术栈

*   **前端核心**：React 18 + TypeScript + Vite + Tailwind CSS
*   **拖拽库**：@dnd-kit/core, @dnd-kit/sortable
*   **浏览器接口**：Chrome Extension API (@types/chrome)
*   **构建工具**：Vite + tsc

## 快速上手与运行

### 1. 安装依赖与构建

```bash
# 安装依赖
npm install

# 编译并打包插件产物 (输出到 dist/ 目录)
npm run build
```

### 2. 在 Chrome 浏览器中加载插件

1.  打开 Chrome 浏览器，进入地址栏输入：`chrome://extensions/`。
2.  在右上角开启 **开发者模式** (Developer mode)。
3.  点击左上角 **加载已解压的扩展程序** (Load unpacked)。
4.  在弹出的文件选择器中，选择本项目编译生成的 `dist` 文件夹即可完成加载。

## 许可证

基于 [MIT License](./LICENSE) 协议开源。
