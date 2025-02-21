# SnipID

一个现代化、灵活的短 ID 生成器，支持分布式场景、ID 解析和多种随机策略。

## 特性

- 🚀 高性能：支持预生成 ID 池，提供批量生成功能
- 🔒 安全可靠：提供多种随机策略，包括安全随机数生成
- 🌐 分布式支持：内置 worker ID 和数据中心 ID 支持
- 🔍 ID 解析：支持从生成的 ID 中解析出时间戳等信息
- 🎯 碰撞检测：可选的 ID 碰撞检测功能
- ⚙️ 高度可配置：支持自定义符号集、时间间隔等多个参数

## 安装

```bash
npm install snipid
```

## 基本用法

```typescript
import { SnipID } from "snipid";

// 创建默认实例
const snipid = new SnipID();

// 生成单个 ID
const id = snipid.generate();

// 批量生成 ID
const ids = snipid.batch(5);

// 生成 UUID 风格的 ID
const uuid = SnipID.uuid();
```

## 配置选项

```typescript
const snipid = new SnipID({
  // 自定义符号集
  symbols: ["A", "B", "C"],

  // 随机部分的长度
  saltLength: 4,

  // 自定义纪元时间（毫秒）
  epoch: 1460332800000,

  // 时间戳生成间隔（毫秒）
  interval: 1000,

  // ID 前缀
  prefix: "test-",

  // 分布式场景的 worker ID (0-1023)
  workerId: 1,

  // 分布式场景的数据中心 ID (0-31)
  datacenterId: 1,

  // 随机数生成策略
  randomStrategy: "secure",

  // 启用 ID 碰撞检测
  collisionDetection: true,

  // 预生成 ID 池大小
  poolSize: 1000,
});
```

## API 参考

### 构造函数

```typescript
new SnipID(options?: Partial<SnipIDOptions>)
```

创建一个新的 SnipID 实例。所有配置选项都是可选的。

### 实例方法

#### generate()

生成一个唯一的 ID。

```typescript
const id = snipid.generate();
```

#### batch(count: number)

批量生成指定数量的唯一 ID。

```typescript
const ids = snipid.batch(5);
```

#### parse(id: string)

解析一个已生成的 ID，提取其中包含的信息。

```typescript
const parsed = snipid.parse(id);
console.log(parsed); // { timestamp, workerId, datacenterId, salt }
```

### 静态方法

#### create(options?: Partial<SnipIDOptions>)

创建一个新的 SnipID 实例的工厂方法。

```typescript
const snipid = SnipID.create({ prefix: "test-" });
```

#### uuid()

生成一个 UUID 风格的 ID（使用较长的盐值）。

```typescript
const uuid = SnipID.uuid();
```

## 高级特性

### 分布式支持

SnipID 通过 `workerId` 和 `datacenterId` 支持分布式场景：

```typescript
// 为不同的服务器实例配置不同的 worker ID 和数据中心 ID
const node1 = new SnipID({ workerId: 1, datacenterId: 1 });
const node2 = new SnipID({ workerId: 2, datacenterId: 1 });
```

### 随机策略

提供三种随机策略：

- `'default'`：默认策略，平衡性能和随机性
- `'nanoid'`：使用 nanoid 风格的随机数生成
- `'secure'`：使用加密安全的随机数生成

```typescript
const secureSnipid = new SnipID({ randomStrategy: "secure" });
```

### ID 池优化

通过配置 ID 池大小来提升性能：

```typescript
const poolSnipid = new SnipID({ poolSize: 1000 });
```

### 碰撞检测

启用碰撞检测以确保 ID 唯一性：

```typescript
const safeSnipid = new SnipID({
  collisionDetection: true,
  saltLength: 4, // 增加盐值长度降低碰撞概率
});
```

## 最佳实践

1. **选择合适的随机策略**

   - 普通应用使用默认策略
   - 需要更高安全性时使用 secure 策略

2. **优化性能**

   - 批量生成场景使用 `batch()` 方法
   - 高并发场景配置适当的 `poolSize`

3. **防止 ID 碰撞**

   - 启用 `collisionDetection`
   - 适当增加 `saltLength`
   - 合理配置 `interval`

4. **分布式部署**
   - 为每个节点分配唯一的 `workerId` 和 `datacenterId`
   - 确保时钟同步

## 许可证

MIT
