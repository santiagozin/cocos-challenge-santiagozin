import { memo, useMemo, type ReactElement } from 'react'
import type { Instrument } from '../../domain/instrument.types'
import { pickTopWinners } from '../../domain/topPerformers'
import { useInstruments } from '../../hooks/useInstruments'
import { InstrumentsWinnersRow } from '../instrumentsWinnersRow/InstrumentsWinnersRow'

export interface InstrumentsWinnersSectionProps {
  readonly onTrade: (instrument: Instrument) => void
}

function InstrumentsWinnersSectionComponent({ onTrade }: InstrumentsWinnersSectionProps): ReactElement | null {
  const instruments = useInstruments()
  const winners = useMemo(
    () => (instruments.isSuccess ? pickTopWinners(instruments.data) : []),
    [instruments.data, instruments.isSuccess],
  )
  const isLoading = instruments.isPending

  if (!isLoading && winners.length === 0) {
    return null
  }

  return (
    <div className="instruments__winners">
      <InstrumentsWinnersRow winners={winners} isLoading={isLoading} onTrade={onTrade} />
    </div>
  )
}

export const InstrumentsWinnersSection = memo(InstrumentsWinnersSectionComponent)