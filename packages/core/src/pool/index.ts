/**
 * ID 池类
 * 用于预生成和缓存 ID，提高生成效率
 */
export class IDPool {
  private readonly pool: string[] = []
  private readonly maxSize: number
  private readonly generator: () => string

  /**
   * 创建 ID 池实例
   * @param maxSize 池的最大容量
   * @param generator ID 生成函数
   */
  constructor(maxSize: number, generator: () => string) {
    this.maxSize = maxSize
    this.generator = generator
    if (maxSize > 0) {
      this.fill()
    }
  }

  /**
   * 填充 ID 池
   * 当池中的 ID 数量低于最大容量时，生成新的 ID 填充
   */
  private fill(): void {
    const batchSize = Math.min(this.maxSize - this.pool.length, 1000)
    for (let i = 0; i < batchSize; i++) {
      this.pool.push(this.generator())
    }
  }

  /**
   * 获取一个 ID
   * 如果池中有 ID，则从池中获取；否则直接生成
   * @returns 生成的 ID
   */
  get(): string | null {
    if (this.maxSize === 0) {
      return null
    }

    if (this.pool.length === 0) {
      this.fill()
    }

    return this.pool.pop() ?? null
  }

  /**
   * 批量获取多个 ID
   * @param count 需要的 ID 数量
   * @returns ID 数组
   */
  getBatch(count: number): string[] {
    if (this.maxSize === 0) {
      return Array.from({ length: count }, () => this.generator())
    }

    while (this.pool.length < count) {
      this.fill()
    }

    return this.pool.splice(0, count)
  }
}
