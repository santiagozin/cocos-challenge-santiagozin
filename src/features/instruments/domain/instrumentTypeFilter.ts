import type { Instrument } from './instrument.types'

export const ALL_INSTRUMENT_TYPES = 'ALL' as const
export type InstrumentTypeFilter = typeof ALL_INSTRUMENT_TYPES | string

const TYPE_LABELS: Record<string, string> = {
  ACCIONES: 'Acciones',
  MONEDA: 'Moneda',
}

export function formatInstrumentTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type
}

export function collectInstrumentTypes(instruments: readonly Instrument[]): readonly string[] {
  const types = new Set<string>()
  for (const instrument of instruments) {
    types.add(instrument.type)
  }
  return [...types].sort((left, right) => left.localeCompare(right, 'es-AR'))
}

export function filterInstrumentsByType(
  instruments: readonly Instrument[],
  selectedType: InstrumentTypeFilter,
): readonly Instrument[] {
  if (selectedType === ALL_INSTRUMENT_TYPES) {
    return instruments
  }
  return instruments.filter((instrument) => instrument.type === selectedType)
}