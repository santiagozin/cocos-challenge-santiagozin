import { ApiError } from '@/shared/api/apiError'
import { isRecord, readFiniteNumber, readString } from '@/shared/api/guards'
import {
  ORDER_SIDES,
  ORDER_STATUSES,
  ORDER_TYPES,
  type Order,
  type OrderResponse,
  type OrderSide,
  type OrderStatus,
  type OrderType,
} from '../domain/order.types'

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

export function parseOrderResponse(value: unknown): OrderResponse {
  if (!isRecord(value)) {
    throw new ApiError(0)
  }

  const id = readFiniteNumber(value, 'id')
  const status = readString(value, 'status')
  if (id === undefined || status === undefined || !isOrderStatus(status)) {
    throw new ApiError(0)
  }

  return { id, status }
}

function isOrderSide(value: string): value is OrderSide {
  return (ORDER_SIDES as readonly string[]).includes(value)
}

function isOrderType(value: string): value is OrderType {
  return (ORDER_TYPES as readonly string[]).includes(value)
}

function parseOrderRecord(value: unknown): Order {
  if (!isRecord(value)) {
    throw new ApiError(0)
  }

  const id = readFiniteNumber(value, 'id')
  const instrumentId = readFiniteNumber(value, 'instrument_id')
  const side = readString(value, 'side')
  const type = readString(value, 'type')
  const quantity = readFiniteNumber(value, 'quantity')
  const status = readString(value, 'status')
  const createdAt = readString(value, 'created_at')
  const priceRaw = value.price

  if (
    id === undefined ||
    instrumentId === undefined ||
    side === undefined ||
    type === undefined ||
    quantity === undefined ||
    status === undefined ||
    createdAt === undefined ||
    !isOrderSide(side) ||
    !isOrderType(type) ||
    !isOrderStatus(status)
  ) {
    throw new ApiError(0)
  }

  let price: number | null = null
  if (priceRaw !== undefined && priceRaw !== null) {
    if (typeof priceRaw !== 'number' || !Number.isFinite(priceRaw)) {
      throw new ApiError(0)
    }

    price = priceRaw
  }

  return {
    id,
    instrument_id: instrumentId,
    side,
    type,
    quantity,
    price,
    status,
    created_at: createdAt,
  }
}

export function parseOrderList(value: unknown): readonly Order[] {
  if (!Array.isArray(value)) {
    throw new ApiError(0)
  }

  return value.map((item) => parseOrderRecord(item))
}