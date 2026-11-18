import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SEARCH_DEBOUNCE_MS } from '@/features/search'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import type { InstrumentTypeFilter } from '../domain/instrumentTypeFilter'
import {
  applyInstrumentsUrlQuery,
  applyInstrumentsUrlType,
  readInstrumentsUrlQuery,
  readInstrumentsUrlType,
} from '../domain/instrumentsUrlParams'

export interface UseInstrumentSearchParamsResult {
  readonly searchQuery: string
  readonly setSearchQuery: (value: string) => void
  readonly appliedQuery: string
  readonly selectedType: InstrumentTypeFilter
  readonly setSelectedType: (type: InstrumentTypeFilter) => void
}

export function useInstrumentSearchParams(): UseInstrumentSearchParamsResult {
  const [searchParams, setSearchParams] = useSearchParams()
  const appliedQuery = readInstrumentsUrlQuery(searchParams)
  const selectedType = readInstrumentsUrlType(searchParams)
  const [searchQuery, setSearchQuery] = useState(appliedQuery)
  const debouncedQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setSearchQuery(appliedQuery)
  }, [appliedQuery])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed === appliedQuery) {
      return
    }
    setSearchParams(
      (current) => applyInstrumentsUrlQuery(current, debouncedQuery),
      { replace: true },
    )
  }, [appliedQuery, debouncedQuery, setSearchParams])

  const setSelectedType = useCallback(
    (type: InstrumentTypeFilter): void => {
      setSearchParams((current) => applyInstrumentsUrlType(current, type), { replace: true })
    },
    [setSearchParams],
  )

  return {
    searchQuery,
    setSearchQuery,
    appliedQuery,
    selectedType,
    setSelectedType,
  }
}