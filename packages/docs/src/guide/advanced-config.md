# 高级配置

SnipID 提供了丰富的配置选项，让你可以根据具体需求自定义 ID 生成的行为。

## 配置选项

创建 SnipID 实例时，你可以传入一个配置对象来自定义各种参数：

```typescript
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
```

## 配置项说明

### symbols

自定义符号集用于生成 ID。你可以指定一个字符数组，这些字符将用于构建 ID 的随机部分。

### saltLength

设置随机盐值的长度。较长的盐值可以降低 ID 冲突的概率，但会增加 ID 的总长度。

### epoch

自定义纪元时间戳，用作时间计算的起点。这对于需要在特定时间范围内生成 ID 的场景很有用。

### interval

时间戳生成的间隔（毫秒）。较大的间隔可以减少 ID 冲突，但会降低 ID 生成的频率。

### prefix

为生成的 ID 添加前缀。这对于区分不同类型或来源的 ID 很有帮助。

### collisionDetection

启用碰撞检测功能。当启用时，SnipID 会确保生成的 ID 不会重复。

## 使用示例

```typescript
// 创建自定义配置的实例
const customSnipid = new SnipID({
  symbols: ["A", "B", "C", "D", "E", "F", "0", "1", "2", "3"],
  saltLength: 6,
  epoch: Date.now(),
  interval: 100,
  prefix: "custom-",
  collisionDetection: true,
});

// 生成自定义 ID
const customId = customSnipid.generate();
console.log("自定义配置生成的 ID:", customId);
```

## 最佳实践

- 根据你的应用场景选择合适的符号集和盐值长度
- 在高并发场景下，适当增加 interval 值以避免冲突
- 使用有意义的前缀来区分不同类型的 ID
- 在数据安全性要求较高的场景下启用碰撞检测
