import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('随机性测试', () => {
  it('应该生成均匀分布的随机部分', () => {
    const snipid = new SnipID({
      symbols: ['0', '1', '2', '3'],
      saltLength: 100, // 减小salt长度以降低内存压力
      randomStrategy: 'secure',
    })
    const id = snipid.generate()
    const counts = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    }

    // 统计每个符号的出现次数
    for (const char of id) {
      if (char in counts)
        counts[char]++
    }

    // 验证分布的均匀性（允许50%的误差，考虑到随机性和实际应用场景）
    const expectedCount = 25 // 100/4
    for (const count of Object.values(counts)) {
      expect(count).toBeGreaterThan(expectedCount * 0.5)
      expect(count).toBeLessThan(expectedCount * 1.5)
    }
  })

  it('应该支持不同的随机策略', () => {
    const strategies = ['default', 'nanoid', 'secure'] as const
    const ids = strategies.map((strategy) => {
      const snipid = new SnipID({ randomStrategy: strategy })
      return snipid.generate()
    })

    expect(new Set(ids).size).toBe(strategies.length) // 验证不同策略生成的ID不同
  })
})
