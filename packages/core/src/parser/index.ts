import type { SnipIDOptions, SnipIDParserReturn } from '../types'

/**
 * ID 解析器类
 * 用于解析生成的 ID，提取其中包含的信息
 */
export class IDParser {
  private readonly options: Required<SnipIDOptions>
  private readonly base: number

  /**
   * 创建 ID 解析器实例
   * @param options 配置选项
   */
  constructor(options: Required<SnipIDOptions>) {
    this.options = options
    this.base = options.symbols.length
  }

  /**
   * 解析 ID，提取其中包含的信息
   * @param id 要解析的 ID 字符串
   * @returns 解析结果，包含时间戳、工作节点ID、数据中心ID和盐值
   */
  parse(id: string): SnipIDParserReturn {
    const { prefix, symbols, interval, epoch } = this.options
    let remainingId = id.startsWith(prefix) ? id.slice(prefix.length) : id

    const result: ReturnType<typeof this.parse> = { salt: '' }

    if (interval > 0 && remainingId.length > 0) {
      const workerLength = this.options.workerId > 0 ? 1 : 0
      const datacenterLength = this.options.datacenterId > 0 ? 1 : 0
      const timestampLength
        = remainingId.length
          - workerLength
          - datacenterLength
          - this.options.saltLength

      const timestampStr = remainingId.slice(0, timestampLength)
      const timestampValue = Number.parseInt(timestampStr, this.base)
      result.timestamp = new Date(timestampValue * interval + epoch)
      remainingId = remainingId.slice(timestampLength)
    }

    if (this.options.workerId > 0 && remainingId.length > 0) {
      const workerStr = remainingId[0]
      const workerValue = Number.parseInt(workerStr, 10)
      result.workerId = Number.isNaN(workerValue)
        ? symbols.indexOf(workerStr)
        : workerValue
      remainingId = remainingId.slice(1)
    }

    if (this.options.datacenterId > 0 && remainingId.length > 0) {
      const datacenterStr = remainingId[0]
      const datacenterValue = Number.parseInt(datacenterStr, 10)
      result.datacenterId = Number.isNaN(datacenterValue)
        ? symbols.indexOf(datacenterStr)
        : datacenterValue
      remainingId = remainingId.slice(1)
    }

    result.salt = remainingId
    return result
  }
}
