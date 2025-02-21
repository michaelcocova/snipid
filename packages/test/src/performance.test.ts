import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('性能测试', () => {
  it('应该高效地批量生成大量ID', () => {
    const snipid = new SnipID({ poolSize: 1000 }) // 减小池大小以降低内存压力
    const startTime = Date.now()
    const batchSize = 1000
    const totalCount = 5000
    const ids = new Set()

    for (let i = 0; i < totalCount; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, totalCount - i)
      const batchIds = snipid.batch(currentBatchSize)
      batchIds.forEach(id => ids.add(id))
    }

    const endTime = Date.now()

    expect(ids.size).toBe(totalCount)
    expect(endTime - startTime).toBeLessThan(1000) // 1秒内完成
  })

  it('应该在启用碰撞检测的情况下保持性能', () => {
    const snipid = new SnipID({ collisionDetection: true })
    const ids = new Set()
    const count = 1000

    for (let i = 0; i < count; i++) {
      const id = snipid.generate()
      ids.add(id)
    }

    expect(ids.size).toBe(count)
  })
})
