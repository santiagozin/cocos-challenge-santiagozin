const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const signedArsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

const percentFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

export function formatArs(amount: number): string {
  return arsFormatter.format(amount)
}

/** Parse amounts in ARS from input (with or without $ symbol, grouping in es-AR). */
export function parseArsInput(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  let normalized = trimmed.replace(/\$/g, '').replace(/\s|\u00a0/g, '')
  if (!/^[\d.,]+$/.test(normalized)) {
    return null
  }

  if (normalized.includes(',')) {
    normalized = normalized.replace(/\./g, '').replace(',', '.')
  } else {
    normalized = normalized.replace(/,/g, '')
  }

  const parsed = Number(normalized)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export function formatSignedArs(amount: number): string {
  return signedArsFormatter.format(amount)
}

export function formatSignedPercent(percent: number): string {
  return `${percentFormatter.format(percent)} %`
}

export type PriceDirection = 'up' | 'down' | 'flat'

export function priceDirection(percent: number): PriceDirection {
  if (percent > 0) {
    return 'up'
  }

  if (percent < 0) {
    return 'down'
  }

  return 'flat'
}
