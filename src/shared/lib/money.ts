const ARS_CENTS_PER_UNIT = 100

/** Pesos → integer cents (rounded to nearest cent). */
export function toArsCents(amount: number): number | null {
  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  const cents = Math.round(amount * ARS_CENTS_PER_UNIT)
  if (cents < 1) {
    return null
  }

  return cents
}

/** Integer cents → pesos for UI and API. */
export function fromArsCents(cents: number): number {
  return cents / ARS_CENTS_PER_UNIT
}

export function floorDivideCents(amountCents: number, unitPriceCents: number): number {
  if (unitPriceCents <= 0) {
    return 0
  }

  return Math.floor(amountCents / unitPriceCents)
}

export function multiplyQuantityByPriceCents(quantity: number, unitPriceCents: number): number | null {
  if (!Number.isInteger(quantity) || quantity < 0) {
    return null
  }

  return quantity * unitPriceCents
}