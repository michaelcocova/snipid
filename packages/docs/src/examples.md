# Examples

## 基本用法示例

### 生成单个 ID

```ts
import { SnipID } from "snipid";

// 创建默认实例
const defaultSnipid = new SnipID();

const singleId = defaultSnipid.generate();
console.log("单个 ID:", singleId);
```

### 批量生成 ID

```ts
import { SnipID } from "snipid";

const defaultSnipid = new SnipID();
const batchIds = defaultSnipid.batch(5);
console.log("批量生成 5 个 ID:", batchIds);
```

### 批量生成 ID

```ts
import { SnipID } from "snipid";

const uuid = SnipID.uuid();
console.log("UUID 风格 ID:", uuid);
```

### 生成 UUID 风格的 ID

```ts
import { SnipID } from "snipid";

const uuid = SnipID.uuid();
console.log("UUID 风格 ID:", uuid);
```

## 高级配置示例

```ts
import { SnipID } from "snipid";

// 创建自定义配置的实例
const customSnipid = new SnipID({
  // 自定义符号集
  symbols: ["A", "B", "C", "D", "E", "F", "0", "1", "2", "3"],
  // 随机部分的长度
  saltLength: 6,
  // 自定义纪元时间
  epoch: Date.now(),
  // 时间戳生成间隔
  interval: 100,
  // ID 前缀
  prefix: "custom-",
  // 启用碰撞检测
  collisionDetection: true,
});

const customId = customSnipid.generate();
console.log("自定义配置生成的 ID:", customId);
```

## 分布式场景示例

```ts
import { SnipID } from "snipid";

// 模拟两个不同的服务器节点
const node1 = new SnipID({ workerId: 1, datacenterId: 1 });
const node2 = new SnipID({ workerId: 2, datacenterId: 1 });

const node1Id = node1.generate();
const node2Id = node2.generate();

console.log("节点 1 生成的 ID:", node1Id);
console.log("节点 2 生成的 ID:", node2Id);
```

## ID 解析示例

```ts
import { SnipID } from "snipid";

const id = new SnipID({ workerId: 1, datacenterId: 1 });

const idForParsing = id.generate();
const parsedInfo = id.parse(idForParsing);

console.log("待解析的 ID:", idForParsing);
console.log("解析结果:", {
  时间戳: parsedInfo.timestamp,
  工作节点ID: parsedInfo.workerId,
  数据中心ID: parsedInfo.datacenterId,
  随机盐值: parsedInfo.salt,
});
```

## 不同随机策略示例

```ts
import { SnipID } from "snipid";

// 默认策略
const defaultStrategy = new SnipID({ randomStrategy: "default" });
console.log("默认随机策略:", defaultStrategy.generate());

// NanoID 风格策略
const nanoidStrategy = new SnipID({ randomStrategy: "nanoid" });
console.log("NanoID 风格策略:", nanoidStrategy.generate());

// 安全随机策略
const secureStrategy = new SnipID({ randomStrategy: "secure" });
console.log("安全随机策略:", secureStrategy.generate());
```

## 性能优化示例

```ts
import { SnipID } from "snipid";

// 使用 ID 池进行预生成
const pooledSnipid = new SnipID({ poolSize: 1000 });

console.time("从 ID 池生成");
const pooledIds = pooledSnipid.batch(100);
console.timeEnd("从 ID 池生成");

console.time("实时生成");
const realtimeIds = defaultSnipid.batch(100);
console.timeEnd("实时生成");

console.log("ID 池生成的前 5 个 ID:", pooledIds.slice(0, 5));
console.log("实时生成的前 5 个 ID:", realtimeIds.slice(0, 5));
```
