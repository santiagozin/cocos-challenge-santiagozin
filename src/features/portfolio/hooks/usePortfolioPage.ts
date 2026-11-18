import { useMemo } from 'react'
import { activeHoldings } from '../domain/portfolioHoldings'
import { summarizePortfolio, type PortfolioSummary } from '../domain/portfolioSummary'
import type { Holding } from '../domain/portfolio.types'
import { usePortfolio } from './usePortfolio'

export interface UsePortfolioPageResult {
  readonly summary: PortfolioSummary | null
  readonly holdings: readonly Holding[]
  readonly isPending: boolean
  readonly isError: boolean
  readonly isEmpty: boolean
}

export function usePortfolioPage(): UsePortfolioPageResult {
  const portfolio = usePortfolio()

  const summary = useMemo(
    () => (portfolio.isSuccess ? summarizePortfolio(portfolio.data.cash, portfolio.data.holdings) : null),
    [portfolio.data, portfolio.isSuccess],
  )

  const holdings = portfolio.isSuccess ? activeHoldings(portfolio.data.holdings) : []

  return {
    summary,
    holdings,
    isPending: portfolio.isPending,
    isError: portfolio.isError,
    isEmpty: portfolio.isSuccess && holdings.length === 0,
  }
}