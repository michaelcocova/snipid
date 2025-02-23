import type { SnipIDOptions, SnipIDParserReturn } from './types'
import { DEFAULT_OPTIONS } from './config'
import { IDParser } from './parser'
import { IDPool } from './pool'
import { createRandomGenerator } from './random'
import { toBase } from './utils'

/**
 * SnipID - 现代、灵活的短 ID 生成器
 * 支持自定义字符集、时间戳编码、分布式场景、碰撞检测等特性
 * 可用于生成短链接、订单号、会话ID等唯一标识
 */
export default class SnipID {
  private readonly options: Required<SnipIDOptions>
  private readonly randomGenerator
  private readonly idPool
  private readonly idParser
  private readonly usedIds: Set<string> = new Set()

  /**
   * 创建 SnipID 实例
   * @param options - 配置选项，可选
   * @throws {Error} 当配置选项验证失败时抛出错误
   */
  constructor(options: Partial<SnipIDOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.validateOptions()

    this.randomGenerator = createRandomGenerator(this.options.randomStrategy)
    this.idParser = new IDParser(this.options)
    this.idPool = new IDPool(this.options.poolSize, () => this.generateId())
  }

  /**
   * 验证配置选项的合法性
   * @private
   * @throws {Error} 当符号集长度不足、工作节点ID或数据中心ID超出范围时抛出错误
   */
  private validateOptions(): void {
    if (this.options.symbols.length <= 1) {
      throw new Error('Symbols array must contain at least 2 characters')
    }

    if (this.options.workerId < 0 || this.options.workerId > 1023) {
      throw new Error('Worker ID must be between 0 and 1023')
    }

    if (this.options.datacenterId < 0 || this.options.datacenterId > 31) {
      throw new Error('Datacenter ID must be between 0 and 31')
    }
  }

  /**
   * 生成唯一标识符
   * @private
   * @returns {string} 生成的唯一标识符
   */
  private generateId(): string {
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
      const salt = this.randomGenerator.generate(saltLength, symbols)

      id = `${prefix}${timestamp}${workerPart}${datacenterPart}${salt}`
    } while (this.options.collisionDetection && this.usedIds.has(id))

    if (this.options.collisionDetection) {
      this.usedIds.add(id)
    }

    return id
  }

  /**
   * 生成一个唯一标识符
   * @returns {string} 生成的唯一标识符
   */
  generate(): string {
    const pooledId = this.idPool.get()
    return pooledId ?? this.generateId()
  }

  /**
   * 批量生成多个唯一标识符
   * @param count - 要生成的标识符数量
   * @returns {string[]} 生成的唯一标识符数组
   */
  batch(count: number): string[] {
    return this.options.poolSize > 0
      ? this.idPool.getBatch(count)
      : Array.from({ length: count }, () => this.generateId())
  }

  /**
   * 解析标识符中包含的信息
   * @param id - 要解析的标识符
   * @returns {SnipIDParserReturn} 解析结果，包含时间戳、工作节点ID、数据中心ID和盐值
   */
  parse(id: string): SnipIDParserReturn {
    return this.idParser.parse(id)
  }

  /**
   * 创建 SnipID 实例的静态工厂方法
   * @param options - 配置选项，可选
   * @returns {SnipID} 新的 SnipID 实例
   */
  static create(options: Partial<SnipIDOptions> = {}): SnipID {
    return new SnipID(options)
  }

  /**
   * 生成一个简短的 UUID
   * @returns {string} 生成的 UUID
   */
  static uuid(): string {
    return new SnipID({ saltLength: 4 }).generate()
  }
}
