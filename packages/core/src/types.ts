/**
 * SnipID 的默认配置
 */
export type RandomStrategy = 'default' | 'nanoid' | 'secure'

export interface SnipIDOptions {
  /** 用于生成 ID 的自定义字符集 */
  symbols?: string[]
  /** 要附加的随机字符数量 */
  saltLength?: number
  /** 自定义纪元起始时间（毫秒） */
  epoch?: number
  /** 时间戳生成的时间间隔（毫秒） */
  interval?: number
  /** 生成 ID 的可选前缀 */
  prefix?: string
  /** 分布式场景下的工作节点 ID（0-1023） */
  workerId?: number
  /** 分布式场景下的数据中心 ID（0-31） */
  datacenterId?: number
  /** 随机数生成策略 */
  randomStrategy?: RandomStrategy
  /** 启用 ID 冲突检测 */
  collisionDetection?: boolean
  /** 预生成 ID 池的大小（0 表示禁用） */
  poolSize?: number
}

export interface SnipIDParserReturn {
  /** 时间戳 */
  timestamp?: Date
  /** 工作节点 ID */
  workerId?: number
  /** 数据中心 ID */
  datacenterId?: number
  /** 盐值 */
  salt: string
}
