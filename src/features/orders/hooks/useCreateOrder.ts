import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { OrderRequest, OrderResponse } from '../domain/order.types'
import { createOrder } from '../services/orders.service'

export function useCreateOrder(): UseMutationResult<OrderResponse, Error, OrderRequest> {
  return useMutation({
    mutationFn: (request: OrderRequest) => createOrder(request),
  })
}