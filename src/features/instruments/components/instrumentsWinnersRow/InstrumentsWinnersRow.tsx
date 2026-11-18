import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo, type ReactElement } from 'react'
import { faArrowRight } from '@/shared/icons'
import { formatSignedPercent, priceDirection } from '@/shared/lib/format'
import { instrumentMark } from '@/shared/lib/instrumentMark'
import type { Instrument } from '../../domain/instrument.types'
import { INSTRUMENTS_TOP_WINNERS_LIMIT, type InstrumentPerformance } from '../../domain/topPerformers'
import './InstrumentsWinnersRow.scss'

export const InstrumentsWinnersRow = memo(function InstrumentsWinnersRow({
  winners,
  isLoading,
  onTrade,
}: {
  readonly winners: readonly InstrumentPerformance[]
  readonly isLoading: boolean
  readonly onTrade: (instrument: Instrument) => void
}): ReactElement | null {
  if (!isLoading && winners.length === 0) {
    return null
  }

  return (
    <section className="instruments-winners" aria-labelledby="instruments-winners-title">
      <header className="instruments-winners__header">
        <h2 id="instruments-winners-title" className="instruments-winners__title">
          Últimos ganadores
        </h2>
      </header>
      <ul className="instruments-winners__grid">
        {isLoading
          ? Array.from({ length: INSTRUMENTS_TOP_WINNERS_LIMIT }, (_, index) => (
              <li key={index}>
                <div className="instruments-winners__card instruments-winners__card--skeleton" aria-hidden />
              </li>
            ))
          : winners.map(({ instrument, returnPercent }) => {
              const direction = priceDirection(returnPercent)
              return (
                <li key={instrument.id}>
                  <button
                    type="button"
                    className="instruments-winners__card"
                    onClick={() => {
                      onTrade(instrument)
                    }}
                    aria-label={`Operar ${instrument.ticker}, variación ${formatSignedPercent(returnPercent)}`}
                  >
                    <div className="instruments-winners__identity">
                      <span className="instruments-winners__mark" aria-hidden>
                        {instrumentMark(instrument.ticker)}
                      </span>
                      <span className="instruments-winners__ticker">{instrument.ticker}</span>
                    </div>
                    <span className={`instruments-winners__change instruments-winners__change--${direction}`}>
                      <span className="instruments-winners__change-value">{formatSignedPercent(returnPercent)}</span>
                    </span>
                    <span className="instruments-winners__action" aria-hidden>
                      <FontAwesomeIcon icon={faArrowRight} className="instruments-winners__action-icon" />
                    </span>
                  </button>
                </li>
              )
            })}
      </ul>
    </section>
  )
})