import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import { Button } from '@/shared/ui'
import type { OrderStatus, OrderType } from '../../domain/order.types'
import { OrderSuccessCheck } from './OrderSuccessCheck'
import { orderStatusDetail } from './orderStatusDetail'

interface OrderOutcomeProps {
  readonly status: OrderStatus
  readonly orderType: OrderType
  readonly orderId: number
  readonly onClose: () => void
}

export function OrderOutcome({ status, orderType, orderId, onClose }: OrderOutcomeProps): ReactElement {
  const navigate = useNavigate()

  const title =
    status === 'FILLED' ? 'Orden ejecutada' : status === 'PENDING' ? 'Orden enviada' : 'Orden rechazada'

  return (
    <div className="order-modal order-modal--outcome" role="status" aria-live="polite">
      <div className="order-modal__outcome">
        <OrderSuccessCheck />
        <h3 className="order-modal__outcome-title">{title}</h3>
        <p className="order-modal__outcome-copy">{orderStatusDetail(status, orderType)}</p>
        <p className="order-modal__outcome-id">Orden {orderId}</p>
        <div className="order-modal__outcome-actions">
          <Button
            type="button"
            className="order-modal__outcome-portfolio"
            onClick={() => {
              navigate(ROUTES.portfolio)
              onClose()
            }}
          >
            Ir al portfolio
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}