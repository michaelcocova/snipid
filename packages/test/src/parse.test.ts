import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('id解析测试', () => {
  it('应该正确解析生成的ID', () => {
    const options = {
      prefix: 'test-',
      interval: 1000,
      workerId: 1,
      datacenterId: 1,
    }
    const testSnipid = new SnipID(options)
    const id = testSnipid.generate()
    const parsed = testSnipid.parse(id)

    expect(parsed.timestamp).toBeInstanceOf(Date)
    expect(parsed.workerId).toBe(options.workerId)
    expect(parsed.datacenterId).toBe(options.datacenterId)
    expect(parsed.salt).toBeDefined()
  })
})
