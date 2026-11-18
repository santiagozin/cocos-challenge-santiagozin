import type { Instrument } from './instrument.types'

const NON_TRADABLE_TYPES = new Set(['MONEDA'])

export function isTradableInstrument(instrument: Instrument): boolean {
  return !NON_TRADABLE_TYPES.has(instrument.type)
}