import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('边界值测试', () => {
  it('应该处理空前缀', () => {
    const snipid = new SnipID({ prefix: '' })
    const id = snipid.generate()
    expect(id).toBeDefined()
    expect(id.length).toBeGreaterThan(0)
  })

  it('应该处理最大长度的salt', () => {
    const snipid = new SnipID({ saltLength: 32 })
    const id = snipid.generate()
    expect(id.length).toBeGreaterThan(31)
  })
})
