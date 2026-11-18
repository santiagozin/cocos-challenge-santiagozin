import { apiGet } from '@/shared/api/httpClient'
import type { Portfolio } from '../domain/portfolio.types'
import { parsePortfolio } from './portfolio.guard'

export function fetchPortfolio(signal?: AbortSignal): Promise<Portfolio> {
  return apiGet('/portfolio', parsePortfolio, signal)
}
