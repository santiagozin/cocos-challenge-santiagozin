export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function readFiniteNumber(
  record: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = record[key]
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }

  return value
}

export function readString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key]
  return typeof value === 'string' ? value : undefined
}
