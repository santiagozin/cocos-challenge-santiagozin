import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState, type ReactElement } from 'react'
import { faClock, faLayerGroup } from '@/shared/icons'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { SearchBox } from '@/features/search'
import { classNames } from '@/shared/ui/classNames'
import type { Holding } from '../domain/portfolio.types'
import { usePortfolioHoldingsFilter } from '../hooks/usePortfolioHoldingsFilter'
import { PortfolioHoldingsTable } from './PortfolioHoldingsTable'
import { PortfolioHoldingsTableSkeleton } from './PortfolioHoldingsTableSkeleton'
import { PortfolioPendingOrdersTable } from './PortfolioPendingOrdersTable'

type PortfolioAssetsTab = 'holdings' | 'pending'

export function PortfolioAssetsPanel({
  holdings,
  totalPatrimony,
  isHoldingsLoading,
  isHoldingsError,
  isHoldingsEmpty,
}: {
  readonly holdings: readonly Holding[]
  readonly totalPatrimony: number
  readonly isHoldingsLoading: boolean
  readonly isHoldingsError: boolean
  readonly isHoldingsEmpty: boolean
}): ReactElement {
  const [tab, setTab] = useState<PortfolioAssetsTab>('holdings')
  const orders = useOrders()

  const pendingCount = useMemo(
    () => (orders.isSuccess ? orders.data.filter((order) => order.status === 'PENDING').length : 0),
    [orders.data, orders.isSuccess],
  )

  const { query, setQuery, filteredHoldings, isFilterEmpty } = usePortfolioHoldingsFilter(holdings)

  return (
    <section className="portfolio__assets" aria-labelledby="portfolio-assets-tabs">
      <div id="portfolio-assets-tabs" className="portfolio__tabs" role="tablist" aria-label="Portfolio">
        <button
          type="button"
          role="tab"
          id="portfolio-tab-holdings"
          className={classNames('portfolio__tab', tab === 'holdings' ? 'portfolio__tab--active' : undefined)}
          aria-selected={tab === 'holdings'}
          aria-controls="portfolio-tabpanel-holdings"
          onClick={() => {
            setTab('holdings')
          }}
        >
          <FontAwesomeIcon icon={faLayerGroup} className="portfolio__tab-icon" aria-hidden />
          Saldos por activo
        </button>
        <button
          type="button"
          role="tab"
          id="portfolio-tab-pending"
          className={classNames('portfolio__tab', tab === 'pending' ? 'portfolio__tab--active' : undefined)}
          aria-selected={tab === 'pending'}
          aria-controls="portfolio-tabpanel-pending"
          onClick={() => {
            setTab('pending')
          }}
        >
          <FontAwesomeIcon icon={faClock} className="portfolio__tab-icon" aria-hidden />
          Operaciones pendientes
          {pendingCount > 0 ? (
            <span className="portfolio__tab-count" aria-label={`${pendingCount} pendientes`}>
              {pendingCount}
            </span>
          ) : null}
        </button>
      </div>

      <div className="portfolio__content">
        {tab === 'holdings' ? (
          <div
            role="tabpanel"
            id="portfolio-tabpanel-holdings"
            aria-labelledby="portfolio-tab-holdings"
          >
            {isHoldingsLoading ? <PortfolioHoldingsTableSkeleton /> : null}

            {!isHoldingsLoading && isHoldingsEmpty ? (
              <p className="portfolio__status portfolio__status--inline" role="status">
                Todavía no tenés posiciones abiertas.
              </p>
            ) : null}

            {!isHoldingsLoading && !isHoldingsError && !isHoldingsEmpty ? (
              <>
                <div className="portfolio__holdings-filter">
                  <SearchBox
                    value={query}
                    onChange={setQuery}
                    layout="compact"
                    label="Filtrar posiciones por ticker"
                    placeholder="Filtrar por ticker"
                    inputName="portfolio-holdings-filter"
                  />
                </div>

                {isFilterEmpty ? (
                  <p className="portfolio__status portfolio__status--inline" role="status">
                    Ninguna posición coincide con tu búsqueda.
                  </p>
                ) : null}

                {!isFilterEmpty ? (
                  <PortfolioHoldingsTable holdings={filteredHoldings} totalPatrimony={totalPatrimony} />
                ) : null}
              </>
            ) : null}
          </div>
        ) : (
          <div
            role="tabpanel"
            id="portfolio-tabpanel-pending"
            aria-labelledby="portfolio-tab-pending"
          >
            <PortfolioPendingOrdersTable />
          </div>
        )}
      </div>
    </section>
  )
}