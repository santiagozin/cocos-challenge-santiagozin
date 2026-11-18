export { SearchBox } from './components/searchBox/SearchBox'
export {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_API_FANOUT,
  SEARCH_QUERY_MAX_LENGTH,
  TICKER_QUERY_MAX_LENGTH,
} from './domain/search.constants'
export { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
export { resolveTickerCandidates } from './domain/searchQueryResolver'
export type { ResolveTickerCandidatesOptions } from './domain/searchQueryResolver'
export {
  useInstrumentsSearch,
  orchestratedSearchKeys,
  type InstrumentsSearchViewModel,
} from './hooks/useInstrumentsSearch'
export { searchKeys, useSearch } from './hooks/useSearch'
export { fetchSearchResults } from './services/search.service'
export { searchInstrumentsOrchestrated } from './services/searchOrchestrator.service'