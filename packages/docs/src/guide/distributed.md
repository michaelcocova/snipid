# 分布式场景

SnipID 提供了强大的分布式支持，可以在多个服务器节点上生成唯一标识符，而不会产生冲突。

## 分布式配置

在分布式环境中，你需要为每个节点配置唯一的 workerId 和 datacenterId：

```typescript
// 创建不同节点的实例
const node1 = new SnipID({ workerId: 1, datacenterId: 1 });
const node2 = new SnipID({ workerId: 2, datacenterId: 1 });
```

## 配置参数说明

### workerId

- 工作节点 ID，用于标识不同的服务器实例
- 取值范围：0-1023
- 在同一数据中心内必须唯一

### datacenterId

- 数据中心 ID，用于标识不同的数据中心
- 取值范围：0-31
- 在整个分布式系统中必须唯一

## 使用示例

```typescript
// 在不同节点上生成 ID
const node1Id = node1.generate();
const node2Id = node2.generate();

console.log("节点 1 生成的 ID:", node1Id);
console.log("节点 2 生成的 ID:", node2Id);
```

## 分布式部署建议

1. **节点 ID 管理**

   - 使用配置中心统一管理 workerId 和 datacenterId
   - 确保每个节点的标识符都是唯一的

2. **容错处理**

   - 在节点启动时验证 ID 的唯一性
   - 实现节点故障时的自动切换机制

3. **扩展性考虑**

   - 预留足够的节点标识符空间
   - 制定清晰的节点扩容方案

4. **监控和维护**
   - 监控各节点的 ID 生成情况
   - 定期检查节点配置的一致性

## 性能优化

在分布式环境中，可以结合 ID 池功能提升性能：

```typescript
// 使用 ID 池优化性能
const pooledNode = new SnipID({
  workerId: 1,
  datacenterId: 1,
  poolSize: 1000, // 预生成 1000 个 ID
});

// 批量获取 ID
const ids = pooledNode.batch(100);
```

## 注意事项

- 确保时钟同步：分布式节点之间的时钟差异会影响 ID 的生成
- 合理配置间隔：根据实际需求调整 interval 参数
- 定期维护：监控和更新节点配置，确保系统稳定运行
