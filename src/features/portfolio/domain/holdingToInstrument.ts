import type { Instrument } from '@/features/instruments/domain/instrument.types'
import type { Holding } from './portfolio.types'

export function holdingToInstrument(holding: Holding): Instrument {
  return {
    id: holding.instrument_id,
    ticker: holding.ticker,
    name: holding.ticker,
    type: '',
    last_price: holding.last_price,
    close_price: holding.close_price,
  }
}