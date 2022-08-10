const toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

export function is(value: unknown, type: string) {
  return toString.call(value) === `[object ${type}]`
}

export function has(value: Record<string, any>, key: string | symbol): key is keyof typeof value {
  return hasOwnProperty.call(value, key)
}

export function isDefined<T = unknown>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

export function isNull(value: unknown): value is null | undefined {
  return value === undefined || value === null
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function isNaN(value: unknown): value is number {
  return Number.isNaN(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isTrue(value: unknown): value is true {
  return value === true
}

export function isFalse(value: unknown): value is false {
  return value === false
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

export function isArray(value: unknown): value is any[] {
  return Array.isArray(value)
}

export function isObject<T extends Record<string, any> = Record<string, any>>(
  value: unknown
): value is T {
  return is(value, 'Object')
}

export function isPromise(value: unknown): value is Promise<any> {
  return (
    !!value &&
    typeof (value as any).then === 'function' &&
    typeof (value as any).catch === 'function'
  )
}

export function isFunction(value: unknown): value is (...any: any[]) => any {
  return typeof value === 'function'
}

export function isSet(value: unknown): value is Set<any> {
  return is(value, 'Set')
}

export function isMap(value: unknown): value is Map<any, any> {
  return is(value, 'Map')
}

export function isDate(value: unknown): value is Date {
  return is(value, 'Date')
}

export function isRegExp(value: unknown): value is RegExp {
  return is(value, 'RegExp')
}

export function isEmpty(value: unknown) {
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}