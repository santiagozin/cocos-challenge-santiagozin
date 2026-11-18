import { useMemo, type ReactElement } from 'react'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { ORDER_SIDE_LABEL, ORDER_TYPE_LABEL } from '@/features/orders/domain/order.labels'
import type { Order } from '@/features/orders/domain/order.types'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { formatArs } from '@/shared/lib/format'
import { instrumentMark } from '@/shared/lib/instrumentMark'
import { Badge } from '@/shared/ui'

const quantityFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 4,
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatOrderDate(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return '—'
  }

  return dateFormatter.format(parsed)
}

function PendingOrderRow({
  order,
  ticker,
}: {
  readonly order: Order
  readonly ticker: string
}): ReactElement {
  return (
    <tr className="portfolio__row">
      <td className="portfolio__cell-asset">
        <div className="portfolio__asset">
          <span className="portfolio__mark" aria-hidden="true">
            {instrumentMark(ticker)}
          </span>
          <span className="portfolio__asset-copy">
            <span className="portfolio__asset-name" title={ticker}>
              {ticker}
            </span>
          </span>
        </div>
      </td>
      <td className="portfolio__cell-order">
        <div className="portfolio__stack">
          <span className="portfolio__stack-primary">{ORDER_SIDE_LABEL[order.side]}</span>
          <span className="portfolio__stack-secondary">{ORDER_TYPE_LABEL[order.type]}</span>
        </div>
      </td>
      <td className="portfolio__cell-quantity portfolio__number">
        {quantityFormatter.format(order.quantity)}
      </td>
      <td className="portfolio__cell-limit portfolio__number">
        {order.type === 'LIMIT' && order.price !== null ? formatArs(order.price) : '—'}
      </td>
      <td className="portfolio__cell-status">
        <Badge tone="pending">Pendiente</Badge>
      </td>
      <td className="portfolio__cell-date portfolio__muted">{formatOrderDate(order.created_at)}</td>
    </tr>
  )
}

export function PortfolioPendingOrdersTable(): ReactElement {
  const orders = useOrders()
  const instruments = useInstruments()

  const tickerById = useMemo(() => {
    if (!instruments.isSuccess) {
      return new Map<number, string>()
    }

    return new Map(instruments.data.map((instrument) => [instrument.id, instrument.ticker]))
  }, [instruments.data, instruments.isSuccess])

  const pending = useMemo(
    () => (orders.isSuccess ? orders.data.filter((order) => order.status === 'PENDING') : []),
    [orders.data, orders.isSuccess],
  )

  if (orders.isPending) {
    return (
      <p className="portfolio__status portfolio__status--inline" role="status">
        Cargando operaciones pendientes…
      </p>
    )
  }

  if (orders.isError) {
    return (
      <p className="portfolio__status portfolio__status--error" role="alert">
        No se pudieron cargar las operaciones pendientes.
      </p>
    )
  }

  if (pending.length === 0) {
    return (
      <p className="portfolio__status portfolio__status--inline" role="status">
        No tenés operaciones pendientes.
      </p>
    )
  }

  return (
    <div className="portfolio__table-panel">
      <div
        className="portfolio__table-scroll"
        tabIndex={0}
        aria-label="Operaciones pendientes, deslizá horizontalmente si no ves todas las columnas"
      >
        <table className="portfolio__table portfolio__table--pending">
          <colgroup>
            <col className="portfolio__col-asset" />
            <col className="portfolio__col-order" />
            <col className="portfolio__col-quantity" />
            <col className="portfolio__col-limit" />
            <col className="portfolio__col-status" />
            <col className="portfolio__col-date" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Activo</th>
              <th scope="col">Operación</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio límite</th>
              <th scope="col">Estado</th>
              <th scope="col">Enviada</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((order) => (
              <PendingOrderRow
                key={order.id}
                order={order}
                ticker={tickerById.get(order.instrument_id) ?? `#${order.instrument_id}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}