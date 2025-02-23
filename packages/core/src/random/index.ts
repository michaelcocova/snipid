import type { RandomStrategy } from '../types'

/**
 * 随机数生成器接口
 */
export interface RandomGenerator {
  /**
   * 生成指定长度的随机字符串
   * @param length 要生成的字符串长度
   * @param symbols 可用的字符集
   * @returns 生成的随机字符串
   */
  generate: (length: number, symbols: string[]) => string
}

/**
 * 默认随机数生成器
 * 使用 Math.random() 生成随机数
 */
export class DefaultRandomGenerator implements RandomGenerator {
  generate(length: number, symbols: string[]): string {
    return Array.from(
      { length },
      () => symbols[Math.floor(Math.random() * symbols.length)],
    ).join('')
  }
}

/**
 * NanoID 风格的随机数生成器
 * 使用类似 nanoid 的算法生成随机数
 */
export class NanoIDRandomGenerator implements RandomGenerator {
  generate(length: number, symbols: string[]): string {
    const mask = (2 << (Math.log(symbols.length - 1) / Math.LN2)) - 1
    const step = Math.ceil((1.6 * mask * length) / symbols.length)
    let id = ''

    while (true) {
      const bytes = new Uint8Array(step)
      const random = Math.random()
      for (let i = 0; i < step; i++) bytes[i] = (random * 256) >>> 0

      for (let i = 0; i < step; i++) {
        const byte = bytes[i] & mask
        if (symbols[byte]) {
          id += symbols[byte]
          if (id.length === length)
            return id
        }
      }
    }
  }
}

/**
 * 安全随机数生成器
 * 使用 crypto API 生成加密安全的随机数
 */
export class SecureRandomGenerator implements RandomGenerator {
  generate(length: number, symbols: string[]): string {
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
        // 降级到默认策略
        return new DefaultRandomGenerator().generate(length, symbols)
      }

      // 使用更好的算法确保均匀分布
      return Array.from(array, (n) => {
        const mask = 2 ** Math.ceil(Math.log2(symbols.length)) - 1
        let value = n & mask
        while (value >= symbols.length) value = (value >> 1) & mask
        return symbols[value]
      }).join('')
    }
    catch (_: any) {
      // 如果出现任何错误，降级到默认策略
      return new DefaultRandomGenerator().generate(length, symbols)
    }
  }
}

/**
 * 创建随机数生成器
 * @param strategy 随机数生成策略
 * @returns 对应策略的随机数生成器实例
 */
export function createRandomGenerator(
  strategy: RandomStrategy,
): RandomGenerator {
  switch (strategy) {
    case 'nanoid':
      return new NanoIDRandomGenerator()
    case 'secure':
      return new SecureRandomGenerator()
    default:
      return new DefaultRandomGenerator()
  }
}
