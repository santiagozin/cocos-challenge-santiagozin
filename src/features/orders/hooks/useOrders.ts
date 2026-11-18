import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Order } from '../domain/order.types'
import { fetchOrders } from '../services/orders.service'

export const orderKeys = {
  all: ['orders'] as const,
}

export function useOrders(): UseQueryResult<readonly Order[], Error> {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: ({ signal }) => fetchOrders(signal),
  })
}