import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('错误处理测试', () => {
  it('应该在符号数组过短时抛出错误', () => {
    expect(() => new SnipID({ symbols: ['A'] })).toThrow()
  })

  it('应该在worker ID超出范围时抛出错误', () => {
    expect(() => new SnipID({ workerId: 1024 })).toThrow()
    expect(() => new SnipID({ workerId: -1 })).toThrow()
  })

  it('应该在数据中心ID超出范围时抛出错误', () => {
    expect(() => new SnipID({ datacenterId: 32 })).toThrow()
    expect(() => new SnipID({ datacenterId: -1 })).toThrow()
  })
})
