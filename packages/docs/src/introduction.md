# 简介

SnipID 支持多种模块规范，包括 ES Module (ESM)、CommonJS (CJS) 和 UMD。本指南将帮助你在不同环境中正确使用 SnipID。

## ES Module (ESM)

ES Module 是现代 JavaScript 推荐的模块系统。如果你的项目支持 ESM，这是最佳选择。

### 安装

```bash
npm install snipid
# 或者使用 yarn
yarn add snipid
# 或者使用 pnpm
pnpm add snipid
```

### 使用方法

```javascript
import { SnipID } from "snipid";

const snipid = new SnipID();
const id = snipid.generate();
console.log(id);
```

## CommonJS (CJS)

如果你正在使用 Node.js 或者较旧的项目，可以使用 CommonJS 规范。

### 使用方法

```javascript
const { SnipID } = require("snipid");

const snipid = new SnipID();
const id = snipid.generate();
console.log(id);
```

## UMD (Universal Module Definition)

UMD 版本可以直接在浏览器中使用，也兼容 AMD 和 CommonJS 规范。

### 通过 CDN 使用

```html
<!-- 使用 unpkg -->
<script src="https://unpkg.com/snipid"></script>

<!-- 或者使用 jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/snipid"></script>

<script>
  const snipid = new SnipID();
  const id = snipid.generate();
  console.log(id);
</script>
```

## 在不同环境中的最佳实践

### 现代前端项目（Vue、React 等）

推荐使用 ES Module：

```javascript
import { SnipID } from "snipid";
```

### Node.js 项目

如果使用 CommonJS：

```javascript
const { SnipID } = require("snipid");
```

如果使用 ES Module（需要在 package.json 中设置 "type": "module"）：

```javascript
import { SnipID } from "snipid";
```

### 浏览器直接使用

推荐使用 CDN 加载 UMD 版本：

```html
<script src="https://unpkg.com/snipid"></script>
```

## 注意事项

1. 确保你的项目环境支持所选择的模块规范
2. 在使用 ES Module 时，确保你的构建工具（如 webpack、vite 等）正确配置
3. 在 Node.js 环境中，注意检查 package.json 中的 "type" 字段设置
4. 使用 CDN 时，建议指定具体的版本号以确保稳定性

## 故障排除

如果遇到模块导入问题，请检查：

1. 项目的模块规范配置是否正确
2. 包管理器是否正确安装了依赖
3. 构建工具的配置是否支持相应的模块规范
4. Node.js 版本是否支持所使用的模块语法
