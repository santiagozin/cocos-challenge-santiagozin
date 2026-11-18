import {
  floorDivideCents,
  fromArsCents,
  multiplyQuantityByPriceCents,
  toArsCents,
} from '@/shared/lib/money'

const ORDER_REJECTION: Record<string, string> = {
  'Insufficient cash':
    'El mercado rechazó la orden porque el monto supera tu saldo disponible.',
  'Insufficient shares':
    'El mercado rechazó la orden porque la cantidad supera tu posición.',
}

export function orderRejectionMessage(detail: string | undefined): string | null {
  if (detail === undefined) {
    return null
  }

  return ORDER_REJECTION[detail] ?? null
}

export function wholeSharesForAmount(amount: number, lastPrice: number): number | null {
  const amountCents = toArsCents(amount)
  const priceCents = toArsCents(lastPrice)
  if (amountCents === null || priceCents === null) {
    return null
  }

  return floorDivideCents(amountCents, priceCents)
}

export function orderNotional(quantity: number, price: number): number | null {
  const priceCents = toArsCents(price)
  if (priceCents === null || !Number.isInteger(quantity) || quantity < 1) {
    return null
  }

  const notionalCents = multiplyQuantityByPriceCents(quantity, priceCents)
  if (notionalCents === null) {
    return null
  }

  return fromArsCents(notionalCents)
}

export function uninvestedAmount(amount: number, shares: number, lastPrice: number): number | null {
  const amountCents = toArsCents(amount)
  const priceCents = toArsCents(lastPrice)
  if (amountCents === null || priceCents === null || !Number.isInteger(shares) || shares < 0) {
    return null
  }

  const investedCents = multiplyQuantityByPriceCents(shares, priceCents)
  if (investedCents === null || investedCents > amountCents) {
    return null
  }

  return fromArsCents(amountCents - investedCents)
}

/** Maximum whole shares affordable with available amount (BUY preview). */
export function maxBuyShares(amount: number, unitPrice: number): number {
  const amountCents = toArsCents(amount)
  const priceCents = toArsCents(unitPrice)
  if (amountCents === null || priceCents === null) {
    return 0
  }

  return floorDivideCents(amountCents, priceCents)
}

/** Estimated proceeds when selling the full position (SELL preview). */
export function sellProceedsAmount(holdingQty: number, unitPrice: number): number {
  if (!Number.isInteger(holdingQty) || holdingQty <= 0) {
    return 0
  }

  return orderNotional(holdingQty, unitPrice) ?? 0
}