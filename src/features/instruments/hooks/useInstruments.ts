import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { readEnv } from '@/shared/config/env'
import type { Instrument } from '../domain/instrument.types'
import { fetchInstruments } from '../services/instruments.service'

export const instrumentKeys = {
  all: ['instruments'] as const,
}

export function useInstruments(): UseQueryResult<readonly Instrument[], Error> {
  const { instrumentsPollMs } = readEnv()

  return useQuery({
    queryKey: instrumentKeys.all,
    queryFn: ({ signal }) => fetchInstruments(signal),
    refetchInterval: instrumentsPollMs,
  })
}
