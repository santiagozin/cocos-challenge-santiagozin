import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { dedupeInstrumentsById } from '../domain/dedupeInstruments'
import { resolveTickerCandidates } from '../domain/searchQueryResolver'
import { fetchSearchResults } from './search.service'

/**
 * When the primary query returns nothing, we fan out to `/search` per catalog-derived ticker.
 */
export async function searchInstrumentsOrchestrated(
  query: string,
  catalog: readonly Instrument[],
  signal?: AbortSignal,
): Promise<readonly Instrument[]> {
  const primary = await fetchSearchResults(query, signal)
  if (primary.length > 0) {
    return primary
  }

  const candidates = resolveTickerCandidates(query, catalog)
  if (candidates.length === 0) {
    return []
  }

  const secondaryBatches = await Promise.all(candidates.map((ticker) => fetchSearchResults(ticker, signal)))
  return dedupeInstrumentsById(secondaryBatches.flat())
}