# 随机策略

SnipID 提供了多种随机策略，以满足不同场景下的 ID 生成需求。每种策略都有其特定的应用场景和性能特点。

## 可用策略

SnipID 支持以下三种随机策略：

### 1. 默认策略 (default)

```typescript
const defaultStrategy = new SnipID({ randomStrategy: "default" });
const id = defaultStrategy.generate();
```

- 平衡了性能和随机性
- 适用于大多数常规场景
- 使用内置的随机数生成器

### 2. NanoID 风格策略 (nanoid)

```typescript
const nanoidStrategy = new SnipID({ randomStrategy: "nanoid" });
const id = nanoidStrategy.generate();
```

- 采用类似 NanoID 的算法
- 生成更短且易读的 ID
- 适合 URL 友好的场景

### 3. 安全随机策略 (secure)

```typescript
const secureStrategy = new SnipID({ randomStrategy: "secure" });
const id = secureStrategy.generate();
```

- 使用加密级随机数生成器
- 提供更高的安全性
- 适用于安全敏感场景

## 策略选择建议

### 使用默认策略当：

- 需要平衡性能和随机性
- 在一般应用场景中使用
- 对性能有一定要求

### 使用 NanoID 策略当：

- 需要生成短小且易读的 ID
- ID 会在 URL 中使用
- 对 ID 长度敏感

### 使用安全策略当：

- 在安全敏感场景中使用
- 需要更高的随机性保证
- 性能不是主要考虑因素

## 性能比较

不同策略的性能特点：

- 默认策略：性能最好，适合高并发场景
- NanoID 策略：性能适中，生成的 ID 较短
- 安全策略：性能较低，但提供更好的随机性

## 使用示例

```typescript
// 比较不同策略
console.log(
  "默认随机策略:",
  new SnipID({ randomStrategy: "default" }).generate(),
);
console.log(
  "NanoID 风格策略:",
  new SnipID({ randomStrategy: "nanoid" }).generate(),
);
console.log(
  "安全随机策略:",
  new SnipID({ randomStrategy: "secure" }).generate(),
);
```

## 最佳实践

1. **策略选择**

   - 根据应用场景选择合适的策略
   - 在不确定时使用默认策略

2. **性能考虑**

   - 在高并发场景优先考虑默认策略
   - 需要安全性时才使用安全策略

3. **配置建议**
   - 同一应用中保持策略一致
   - 避免频繁切换策略

## 注意事项

- 不同策略生成的 ID 格式可能不同
- 安全策略可能影响性能
- 确保选择的策略符合业务需求
