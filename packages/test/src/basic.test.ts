import { SnipID } from '@snipid/core'
import { describe, expect, it } from 'vitest'

const snipid = new SnipID()
describe('基础功能测试', () => {
  it('应该生成一个非空的ID', () => {
    const id = snipid.generate()
    expect(id).toBeDefined()
    expect(id.length).toBeGreaterThan(0)
  })

  it('应该生成不重复的ID', () => {
    const ids = new Set()
    for (let i = 0; i < 1000; i++) {
      const id = snipid.generate()
      expect(ids.has(id)).toBe(false)
      ids.add(id)
    }
  })

  it('应该在大规模场景下生成唯一ID', () => {
    const largeSnipid = new SnipID({
      saltLength: 16,
      randomStrategy: 'secure',
    })
    const ids = new Set()
    const count = 100000
    const startTime = Date.now()

    for (let i = 0; i < count; i++) {
      const id = largeSnipid.generate()
      expect(ids.has(id)).toBe(false)
      ids.add(id)
    }

    const endTime = Date.now()
    expect(ids.size).toBe(count)
    expect(endTime - startTime).toBeLessThan(5000) // 5秒内完成10万个ID生成
  })

  it('应该正确生成指定数量的批量ID', () => {
    const count = 5
    const ids = snipid.batch(count)
    expect(ids).toHaveLength(count)
    expect(new Set(ids).size).toBe(count) // 验证没有重复
  })

  it('应该生成UUID格式的ID', () => {
    const uuid = SnipID.uuid()
    expect(uuid).toBeDefined()
    expect(uuid.length).toBeGreaterThan(4) // 因为saltLength为4
  })
})
