import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

describe('配置选项测试', () => {
  it('应该使用自定义符号生成ID', () => {
    const customSymbols = ['A', 'B', 'C']
    const customSnipid = new SnipID({ symbols: customSymbols })
    const id = customSnipid.generate()
    expect([...id].every(char => customSymbols.includes(char))).toBe(true)
  })

  it('应该使用自定义前缀生成ID', () => {
    const prefix = 'test-'
    const prefixSnipid = new SnipID({ prefix })
    const id = prefixSnipid.generate()
    expect(id.startsWith(prefix)).toBe(true)
  })

  it('应该根据时间间隔生成递增的ID', () => {
    const intervalSnipid = new SnipID({ interval: 1000 }) // 1秒间隔
    const id1 = intervalSnipid.generate()
    const id2 = intervalSnipid.generate()
    expect(id1).not.toBe(id2)
  })
})
