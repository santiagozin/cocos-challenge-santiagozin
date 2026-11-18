import { apiGet, apiPost } from '@/shared/api/httpClient'
import type { Order, OrderRequest, OrderResponse } from '../domain/order.types'
import { parseOrderList, parseOrderResponse } from './order.guard'

export function createOrder(
  request: OrderRequest,
  signal?: AbortSignal,
): Promise<OrderResponse> {
  return apiPost('/orders', request, parseOrderResponse, signal)
}

export function fetchOrders(signal?: AbortSignal): Promise<readonly Order[]> {
  return apiGet('/orders', parseOrderList, signal)
}