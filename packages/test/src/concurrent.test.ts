import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('并发测试', () => {
  it('应该在多个实例同时生成时保持唯一性', () => {
    const instances = Array.from({ length: 5 }, (_, i) => {
      return new SnipID({ workerId: i, datacenterId: 1 })
    })

    const ids = new Set()
    const batchSize = 20
    const totalPerInstance = 100

    instances.forEach((instance) => {
      for (let i = 0; i < totalPerInstance; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, totalPerInstance - i)
        const batchIds = instance.batch(currentBatchSize)
        batchIds.forEach(id => ids.add(id))
      }
    })

    expect(ids.size).toBe(500) // 5个实例各生成100个ID
  })
})
