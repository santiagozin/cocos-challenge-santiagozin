import type { OrderStatus, OrderType } from '../../domain/order.types'

export function orderStatusDetail(status: OrderStatus, orderType: OrderType): string {
  if (status === 'PENDING') {
    return orderType === 'LIMIT'
      ? 'La orden límite quedó enviada al mercado y todavía no se ejecutó.'
      : 'La orden quedó enviada al mercado y todavía no se ejecutó.'
  }

  if (status === 'FILLED') {
    return orderType === 'MARKET'
      ? 'La orden a mercado se ejecutó al enviarse.'
      : 'La orden se ejecutó.'
  }

  return 'El mercado rechazó la orden porque no cumple los requisitos, por ejemplo un monto mayor al disponible.'
}