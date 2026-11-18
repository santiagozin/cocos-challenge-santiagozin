import type { ReactElement } from 'react'
import { usePortfolioPage } from '../hooks/usePortfolioPage'
import { PortfolioAssetsPanel } from '../components/PortfolioAssetsPanel'
import { PortfolioBalances } from '../components/PortfolioBalances'
import { PortfolioBalancesSkeleton } from '../components/PortfolioBalancesSkeleton'
import './PortfolioPage.scss'

export function PortfolioPage(): ReactElement {
  const { summary, holdings, isPending, isError, isEmpty } = usePortfolioPage()

  return (
    <section className="portfolio">
      <header className="portfolio__page-header">
        <h1 className="portfolio__title">Portfolio</h1>
      </header>

      {isPending ? <PortfolioBalancesSkeleton /> : null}

      {isError ? (
        <p className="portfolio__status portfolio__status--error" role="alert">
          No se pudo cargar el portfolio.
        </p>
      ) : null}

      {!isPending && summary !== null ? <PortfolioBalances summary={summary} /> : null}

      <PortfolioAssetsPanel
        holdings={holdings}
        totalPatrimony={summary?.totalPatrimony ?? 0}
        isHoldingsLoading={isPending}
        isHoldingsError={isError}
        isHoldingsEmpty={!isPending && isEmpty}
      />
    </section>
  )
}