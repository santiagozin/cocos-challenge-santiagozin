import {
  maxBuyShares,
  sellProceedsAmount,
} from './order.calculations'
import type { OrderRequest, OrderSide, OrderType } from './order.types'

export function readPositiveDecimal(value: string): number | null {
  const trimmed = value.trim()
  if (!/^\d+([.,]\d+)?$/.test(trimmed)) {
    return null
  }

  const parsed = Number(trimmed.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

export function readWholeQuantity(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function computeMaxShares(
  side: OrderSide,
  cash: number,
  holdingQty: number,
  unitPrice: number,
): number {
  if (side === 'SELL') {
    return Math.max(holdingQty, 0)
  }

  return maxBuyShares(cash, unitPrice)
}

export function computeMaxAmount(
  side: OrderSide,
  cash: number,
  holdingQty: number,
  unitPrice: number,
): number {
  if (side === 'BUY') {
    return Math.max(cash, 0)
  }

  return sellProceedsAmount(holdingQty, unitPrice)
}

export function buildOrderRequest(draft: {
  readonly instrumentId: number
  readonly side: OrderSide
  readonly orderType: OrderType
  readonly quantity: number
  readonly limitPrice: string
}): OrderRequest | null {
  if (draft.orderType === 'MARKET') {
    return {
      instrument_id: draft.instrumentId,
      side: draft.side,
      type: 'MARKET',
      quantity: draft.quantity,
    }
  }

  const price = readPositiveDecimal(draft.limitPrice)
  if (price === null) {
    return null
  }

  return {
    instrument_id: draft.instrumentId,
    side: draft.side,
    type: 'LIMIT',
    quantity: draft.quantity,
    price,
  }
}