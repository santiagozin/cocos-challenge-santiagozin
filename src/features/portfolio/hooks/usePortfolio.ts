import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Portfolio } from '../domain/portfolio.types'
import { fetchPortfolio } from '../services/portfolio.service'

export const portfolioKeys = {
  all: ['portfolio'] as const,
}

export function usePortfolio(): UseQueryResult<Portfolio, Error> {
  return useQuery({
    queryKey: portfolioKeys.all,
    queryFn: ({ signal }) => fetchPortfolio(signal),
  })
}
