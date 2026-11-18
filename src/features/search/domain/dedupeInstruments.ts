import type { Instrument } from '@/features/instruments/domain/instrument.types'

export function dedupeInstrumentsById(instruments: readonly Instrument[]): readonly Instrument[] {
  const byId = new Map<number, Instrument>()
  for (const instrument of instruments) {
    byId.set(instrument.id, instrument)
  }
  return [...byId.values()]
}