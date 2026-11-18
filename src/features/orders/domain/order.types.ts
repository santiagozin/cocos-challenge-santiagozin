export const ORDER_SIDES = ['BUY', 'SELL'] as const
export type OrderSide = (typeof ORDER_SIDES)[number]

export const ORDER_TYPES = ['MARKET', 'LIMIT'] as const
export type OrderType = (typeof ORDER_TYPES)[number]

export const ORDER_STATUSES = ['PENDING', 'REJECTED', 'FILLED'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

interface OrderRequestBase {
  readonly instrument_id: number
  readonly side: OrderSide
  readonly quantity: number
}

export interface MarketOrderRequest extends OrderRequestBase {
  readonly type: 'MARKET'
}

export interface LimitOrderRequest extends OrderRequestBase {
  readonly type: 'LIMIT'
  readonly price: number
}

export type OrderRequest = MarketOrderRequest | LimitOrderRequest

export interface OrderResponse {
  readonly id: number
  readonly status: OrderStatus
}

export interface Order {
  readonly id: number
  readonly instrument_id: number
  readonly side: OrderSide
  readonly type: OrderType
  readonly quantity: number
  readonly price: number | null
  readonly status: OrderStatus
  readonly created_at: string
}