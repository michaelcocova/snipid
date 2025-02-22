# 基本用法

SnipID 提供了简单直观的 API 来生成唯一标识符。以下是基本用法示例：

## 创建实例

首先，创建一个 SnipID 的默认实例：

```typescript
import { SnipID } from "snipid";

const defaultSnipid = new SnipID();
```

## 生成单个 ID

使用 `generate()` 方法生成单个唯一标识符：

```typescript
const singleId = defaultSnipid.generate();
console.log("单个 ID:", singleId);
```

## 批量生成 ID

使用 `batch()` 方法一次性生成多个唯一标识符：

```typescript
const batchIds = defaultSnipid.batch(5);
console.log("批量生成 5 个 ID:", batchIds);
```

## UUID 风格

SnipID 还提供了生成 UUID 风格标识符的静态方法：

```typescript
const uuid = SnipID.uuid();
console.log("UUID 风格 ID:", uuid);
```

## 特点

- 简单易用：API 设计直观，使用方便
- 灵活性：支持单个和批量生成
- 多样化：支持默认格式和 UUID 格式
- 可靠性：生成的 ID 保证唯一性
