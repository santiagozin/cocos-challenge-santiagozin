import { apiGet } from '@/shared/api/httpClient'
import type { Instrument } from '../domain/instrument.types'
import { parseInstrumentList } from './instrument.guard'

export function fetchInstruments(signal?: AbortSignal): Promise<readonly Instrument[]> {
  return apiGet('/instruments', parseInstrumentList, signal)
}
