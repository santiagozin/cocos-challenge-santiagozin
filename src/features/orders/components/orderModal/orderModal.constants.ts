import type { BadgeTone } from '@/shared/ui/Badge/Badge'
import { ORDER_SIDE_LABEL, ORDER_STATUS_LABEL, ORDER_TYPE_LABEL } from '../../domain/order.labels'
import type { OrderStatus } from '../../domain/order.types'

export const SIDE_OPTIONS = [
  { value: 'BUY' as const, label: ORDER_SIDE_LABEL.BUY },
  { value: 'SELL' as const, label: ORDER_SIDE_LABEL.SELL },
]

export const TYPE_OPTIONS = [
  { value: 'MARKET' as const, label: ORDER_TYPE_LABEL.MARKET },
  { value: 'LIMIT' as const, label: ORDER_TYPE_LABEL.LIMIT },
]

export const MODE_OPTIONS = [
  { value: 'shares' as const, label: 'Cantidad' },
  { value: 'amount' as const, label: 'Monto' },
]

export const ORDER_STATUS_BADGE_LABEL = ORDER_STATUS_LABEL

export const ORDER_STATUS_TONE = {
  PENDING: 'pending',
  FILLED: 'positive',
  REJECTED: 'negative',
} as const satisfies Record<OrderStatus, BadgeTone>