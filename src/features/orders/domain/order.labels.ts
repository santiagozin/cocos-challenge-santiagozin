import type { OrderSide, OrderStatus, OrderType } from './order.types'

export const ORDER_SIDE_LABEL: Record<OrderSide, string> = {
  BUY: 'Compra',
  SELL: 'Venta',
}

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  MARKET: 'Mercado',
  LIMIT: 'Límite',
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  FILLED: 'Ejecutada',
  REJECTED: 'Rechazada',
}