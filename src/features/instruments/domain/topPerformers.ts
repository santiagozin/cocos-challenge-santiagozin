import type { Instrument } from './instrument.types'
import { priceReturnPercent } from './instrument.calculations'

export const INSTRUMENTS_TOP_WINNERS_LIMIT = 5

export interface InstrumentPerformance {
  readonly instrument: Instrument
  readonly returnPercent: number
}

/**
 * Instruments with the highest positive return since the previous close.
 */
export function pickTopWinners(
  instruments: readonly Instrument[],
  limit: number = INSTRUMENTS_TOP_WINNERS_LIMIT,
): readonly InstrumentPerformance[] {
  const ranked: InstrumentPerformance[] = []

  for (const instrument of instruments) {
    const returnPercent = priceReturnPercent(instrument.last_price, instrument.close_price)
    if (returnPercent === null || returnPercent <= 0) {
      continue
    }
    ranked.push({ instrument, returnPercent })
  }

  return ranked
    .sort((left, right) => {
      const delta = right.returnPercent - left.returnPercent
      if (delta !== 0) {
        return delta
      }
      return left.instrument.ticker.localeCompare(right.instrument.ticker, 'es-AR', { sensitivity: 'base' })
    })
    .slice(0, limit)
}