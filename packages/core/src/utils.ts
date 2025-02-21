/**
 * 使用提供的字符集将十进制数转换为自定义进制
 */
export function toBase(decimal: number, symbols: string[]): string {
  const base = symbols.length
  let conversion = ''

  while (decimal >= 1) {
    conversion = symbols[decimal % base] + conversion
    decimal = Math.floor(decimal / base)
  }

  return conversion
}

/**
 * 生成随机盐值字符
 */
export function generateSalt(length: number, symbols: string[]): string {
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
    // 如果无法使用加密随机数，则使用改进的Math.random()
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 0xFFFFFFFF)
    }
  }

  return Array.from(array, n => symbols[n % symbols.length]).join('')
}
