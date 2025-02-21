import type { SnipIDOptions } from './types'
import { DEFAULT_OPTIONS } from './config'
import { generateSalt, toBase } from './utils'

/**
 * SnipID - 现代、灵活的短 ID 生成器
 * 支持自定义字符集、时间戳编码、分布式场景、碰撞检测等特性
 * 可用于生成短链接、订单号、会话ID等唯一标识
 */
export default class SnipID {
  /** 配置选项，包含所有必需的配置项 */
  private readonly options: Required<SnipIDOptions>
  /** 字符集基数，用于时间戳编码 */
  private readonly base: number
  /** ID 池，用于预生成和缓存 ID */
  private idPool: string[] = []
  /** 已使用的 ID 集合，用于碰撞检测 */
  private readonly usedIds: Set<string> = new Set()

  /**
   * 创建 SnipID 实例
   * @param options 配置选项，所有选项都是可选的
   * @throws {Error} 当字符集长度小于2、工作节点ID或数据中心ID超出范围时抛出错误
   */
  constructor(options: Partial<SnipIDOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.base = this.options.symbols.length

    if (this.base <= 1) {
      throw new Error('Symbols array must contain at least 2 characters')
    }

    if (this.options.workerId < 0 || this.options.workerId > 1023) {
      throw new Error('Worker ID must be between 0 and 1023')
    }

    if (this.options.datacenterId < 0 || this.options.datacenterId > 31) {
      throw new Error('Datacenter ID must be between 0 and 31')
    }

    if (this.options.poolSize > 0) {
      this.fillPool()
    }
  }

  /**
   * 生成一个唯一的 ID
   * ID 由以下部分组成：prefix + timestamp + workerId + datacenterId + salt
   * - prefix: 可选的前缀
   * - timestamp: 基于 interval 和 epoch 计算的时间戳，使用自定义字符集编码
   * - workerId: 工作节点ID（0-1023）
   * - datacenterId: 数据中心ID（0-31）
   * - salt: 随机生成的盐值，用于确保唯一性
   * @returns 生成的唯一ID
   */
  generate(): string {
    if (this.options.poolSize > 0 && this.idPool.length > 0) {
      return this.idPool.pop()!
    }

    const {
      interval,
      epoch,
      prefix,
      symbols,
      saltLength,
      workerId,
      datacenterId,
    } = this.options
    const elapsed
      = interval > 0 ? Math.floor((Date.now() - epoch) / interval) : 0
    const timestamp = elapsed === 0 ? '' : toBase(elapsed, symbols)

    let id: string
    do {
      const workerPart = workerId > 0 ? workerId.toString() : ''
      const datacenterPart = datacenterId > 0 ? datacenterId.toString() : ''
      const salt = this.generateRandomPart(saltLength)

      id = `${prefix}${timestamp}${workerPart}${datacenterPart}${salt}`
    } while (this.options.collisionDetection && this.usedIds.has(id))

    if (this.options.collisionDetection) {
      this.usedIds.add(id)
    }

    return id
  }

  /**
   * 生成多个唯一的 ID
   */
  private generateRandomPart(length: number): string {
    const { symbols, randomStrategy } = this.options

    switch (randomStrategy) {
      case 'nanoid':
        return Array.from(
          { length },
          () => symbols[Math.floor(Math.random() * symbols.length)],
        ).join('')
      case 'secure': {
        try {
          const array = new Uint32Array(length)
          if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(array)
          }
          else if (
            typeof window !== 'undefined'
            && window.crypto
            && window.crypto.getRandomValues
          ) {
            window.crypto.getRandomValues(array)
          }
          else {
            // 降级到nanoid策略
            return Array.from(
              { length },
              () => symbols[Math.floor(Math.random() * symbols.length)],
            ).join('')
          }
          // 使用更好的算法确保均匀分布
          return Array.from(array, (n) => {
            // 找到最接近 symbols.length 的 2 的幂的倍数
            const mask = 2 ** Math.ceil(Math.log2(symbols.length)) - 1
            // 重新生成直到得到有效值
            let value = n & mask
            while (value >= symbols.length) value = (value >> 1) & mask
            return symbols[value]
          }).join('')
        }
        catch (_: any) {
          // 如果出现任何错误，降级到nanoid策略
          return Array.from(
            { length },
            () => symbols[Math.floor(Math.random() * symbols.length)],
          ).join('')
        }
      }
      default:
        return generateSalt(length, symbols)
    }
  }

  private fillPool(): void {
    const batchSize = Math.min(this.options.poolSize, 1000)
    while (this.idPool.length < this.options.poolSize) {
      const newIds = Array.from({ length: batchSize }, () => this.generate())
      this.idPool.push(...newIds)
    }
  }

  /**
   * 解析 ID，提取其中包含的信息
   * 该方法将一个已生成的 ID 分解为其组成部分：时间戳、工作节点ID、数据中心ID和盐值
   *
   * @param id 要解析的 ID 字符串，可以包含或不包含前缀
   * @returns 解析结果对象，包含以下字段：
   *   - timestamp: 可选，ID生成时的时间戳（如果启用了时间戳功能）
   *   - workerId: 可选，生成该ID的工作节点ID（如果配置了workerId）
   *   - datacenterId: 可选，生成该ID的数据中心ID（如果配置了datacenterId）
   *   - salt: 字符串，用于确保唯一性的随机盐值
   *
   * @example
   * ```typescript
   * const id = snipid.generate(); // 生成一个ID
   * const parsed = snipid.parse(id); // 解析该ID
   * console.log(parsed); // { timestamp: Date, workerId: 1, datacenterId: 1, salt: "abc" }
   * ```
   */
  parse(id: string): {
    timestamp?: Date
    workerId?: number
    datacenterId?: number
    salt: string
  } {
    // 从配置中获取必要的参数
    const { prefix, symbols, interval, epoch } = this.options
    // 如果ID包含前缀，则移除前缀部分
    let remainingId = id.startsWith(prefix) ? id.slice(prefix.length) : id

    // 初始化解析结果对象，salt 字段为必需
    const result: ReturnType<typeof this.parse> = { salt: '' }

    // 如果启用了时间戳功能（interval > 0），则解析时间戳部分
    if (interval > 0 && remainingId.length > 0) {
      // 计算时间戳部分的长度：总长度减去工作节点ID长度、数据中心ID长度和盐值长度
      const workerLength = this.options.workerId > 0 ? 1 : 0 // 工作节点ID占用1位或0位
      const datacenterLength = this.options.datacenterId > 0 ? 1 : 0 // 数据中心ID占用1位或0位
      const timestampLength
        = remainingId.length
          - workerLength
          - datacenterLength
          - this.options.saltLength

      // 提取时间戳字符串并转换为数值
      const timestampStr = remainingId.slice(0, timestampLength)
      const timestampValue = Number.parseInt(timestampStr, this.base) // 使用自定义字符集的基数解析

      // 计算实际的时间戳：将时间间隔值乘以间隔时间，再加上纪元时间
      result.timestamp = new Date(timestampValue * interval + epoch)
      // 从剩余ID中移除已处理的时间戳部分
      remainingId = remainingId.slice(timestampLength)
    }

    // 如果配置了工作节点ID且剩余ID长度大于0，则解析工作节点ID部分
    if (this.options.workerId > 0 && remainingId.length > 0) {
      // 获取工作节点ID字符（占用1位）
      const workerStr = remainingId[0]
      // 尝试将字符解析为数字，如果失败则在字符集中查找其索引
      const workerValue = Number.parseInt(workerStr, 10)
      result.workerId = Number.isNaN(workerValue)
        ? symbols.indexOf(workerStr)
        : workerValue
      // 从剩余ID中移除已处理的工作节点ID部分
      remainingId = remainingId.slice(1)
    }

    // 如果配置了数据中心ID且剩余ID长度大于0，则解析数据中心ID部分
    if (this.options.datacenterId > 0 && remainingId.length > 0) {
      // 获取数据中心ID字符（占用1位）
      const datacenterStr = remainingId[0]
      // 尝试将字符解析为数字，如果失败则在字符集中查找其索引
      const datacenterValue = Number.parseInt(datacenterStr, 10)
      result.datacenterId = Number.isNaN(datacenterValue)
        ? symbols.indexOf(datacenterStr)
        : datacenterValue
      // 从剩余ID中移除已处理的数据中心ID部分
      remainingId = remainingId.slice(1)
    }

    // 剩余的所有字符都是盐值部分
    result.salt = remainingId
    // 返回完整的解析结果
    return result
  }

  /**
   * 批量生成多个唯一 ID
   * 如果启用了 ID 池，会优先使用池中的 ID
   * @param count 要生成的 ID 数量
   * @returns ID 数组
   */
  batch(count: number): string[] {
    if (this.options.poolSize > 0) {
      while (this.idPool.length < count) {
        this.fillPool()
      }
      return this.idPool.splice(0, count)
    }
    return Array.from({ length: count }, () => this.generate())
  }

  /**
   * 使用自定义选项创建新实例
   * 工厂方法，提供一种更优雅的实例化方式
   * @param options 配置选项
   * @returns 新的 SnipID 实例
   */
  static create(options: Partial<SnipIDOptions> = {}): SnipID {
    return new SnipID(options)
  }

  /**
   * 生成类似 UUID 的 ID
   * 使用较长的盐值长度（4）来生成更长的 ID
   * @returns 生成的 ID
   */
  static uuid(): string {
    return new SnipID({ saltLength: 4 }).generate()
  }
}
