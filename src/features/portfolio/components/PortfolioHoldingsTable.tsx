import { useState, type ReactElement } from 'react'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { isTradableInstrument } from '@/features/instruments/domain/instrumentTradability'
import { PerformanceValue } from '@/features/instruments/components/instrumentReturn/InstrumentReturn'
import { priceReturnPercent } from '@/features/instruments/domain/instrument.calculations'
import { OrderModal } from '@/features/orders'
import { formatArs, formatSignedArs } from '@/shared/lib/format'
import { instrumentMark } from '@/shared/lib/instrumentMark'
import { Button } from '@/shared/ui'
import { holdingToInstrument } from '../domain/holdingToInstrument'
import { holdingPortfolioPercent, marketValue, positionGain, totalReturnPercent } from '../domain/portfolio.calculations'
import type { Holding } from '../domain/portfolio.types'
import { PortfolioWeightBar } from './PortfolioWeightBar'

const quantityFormatter = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 4,
})

function HoldingRow({
  holding,
  totalPatrimony,
  onTrade,
}: {
  readonly holding: Holding
  readonly totalPatrimony: number
  readonly onTrade: (instrument: Instrument) => void
}): ReactElement {
  const value = marketValue(holding.quantity, holding.last_price)
  const dayChange = priceReturnPercent(holding.last_price, holding.close_price)
  const performance = totalReturnPercent(holding.last_price, holding.avg_cost_price)
  const gain = positionGain(holding.quantity, holding.last_price, holding.avg_cost_price)
  const weight = holdingPortfolioPercent(value, totalPatrimony)

  const instrument = holdingToInstrument(holding)
  const tradable = isTradableInstrument(instrument)

  function openTrade(): void {
    onTrade(instrument)
  }

  return (
    <tr
      className="portfolio__row portfolio__row--clickable"
      onClick={openTrade}
      title={`Operar ${holding.ticker}`}
    >
      <td className="portfolio__cell-asset">
        <div className="portfolio__asset">
          <span className="portfolio__mark" aria-hidden="true">
            {instrumentMark(holding.ticker)}
          </span>
          <span className="portfolio__asset-copy">
            <span className="portfolio__asset-name" title={holding.ticker}>
              {holding.ticker}
            </span>
          </span>
        </div>
      </td>
      <td className="portfolio__cell-balance">
        <div className="portfolio__stack">
          <span className="portfolio__stack-primary">
            {quantityFormatter.format(holding.quantity)} <span className="portfolio__unit">{holding.ticker}</span>
          </span>
          <span className="portfolio__stack-secondary">{value === null ? '—' : formatArs(value)}</span>
        </div>
      </td>
      <td className="portfolio__cell-price">
        <div className="portfolio__stack">
          <span className="portfolio__stack-primary">{formatArs(holding.last_price)}</span>
          <span className="portfolio__stack-secondary">
            {dayChange === null ? (
              <span className="portfolio__muted">N/D</span>
            ) : (
              <PerformanceValue percent={dayChange} />
            )}
          </span>
        </div>
      </td>
      <td className="portfolio__cell-weight">
        <PortfolioWeightBar percent={weight} />
      </td>
      <td className="portfolio__cell-return">
        <div className="portfolio__stack portfolio__stack--end">
          <span className="portfolio__stack-primary">
            {performance === null ? '—' : <PerformanceValue percent={performance} />}
          </span>
          <span className="portfolio__stack-secondary portfolio__muted">
            {gain === null ? '—' : formatSignedArs(gain)}
          </span>
        </div>
      </td>
      <td className="portfolio__cell-action">
        <div className="portfolio__actions">
          <Button
            type="button"
            className="portfolio__trade-btn"
            disabled={!tradable}
            title={tradable ? undefined : 'Este instrumento no se puede operar'}
            onClick={(event) => {
              event.stopPropagation()
              openTrade()
            }}
          >
            Operar
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function PortfolioHoldingsTable({
  holdings,
  totalPatrimony,
}: {
  readonly holdings: readonly Holding[]
  readonly totalPatrimony: number
}): ReactElement {
  const [orderInstrument, setOrderInstrument] = useState<Instrument | null>(null)

  return (
    <>
      <div className="portfolio__table-panel">
        <div
          className="portfolio__table-scroll"
          tabIndex={0}
          aria-label="Saldos por activo, deslizá horizontalmente si no ves todas las columnas"
        >
          <table className="portfolio__table">
            <colgroup>
              <col className="portfolio__col-asset" />
              <col className="portfolio__col-balance" />
              <col className="portfolio__col-price" />
              <col className="portfolio__col-weight" />
              <col className="portfolio__col-return" />
              <col className="portfolio__col-action" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="portfolio__cell-asset">
                  Activo
                </th>
                <th scope="col" className="portfolio__cell-balance">
                  Saldo total
                </th>
                <th scope="col" className="portfolio__cell-price">
                  Precio
                </th>
                <th scope="col" className="portfolio__cell-weight">
                  % portafolio
                </th>
                <th scope="col" className="portfolio__cell-return">
                  Ganancia
                </th>
                <th scope="col" className="portfolio__cell-action">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <HoldingRow
                  key={holding.instrument_id}
                  holding={holding}
                  totalPatrimony={totalPatrimony}
                  onTrade={setOrderInstrument}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrderModal
        instrument={orderInstrument}
        open={orderInstrument !== null}
        onClose={() => {
          setOrderInstrument(null)
        }}
      />
    </>
  )
}