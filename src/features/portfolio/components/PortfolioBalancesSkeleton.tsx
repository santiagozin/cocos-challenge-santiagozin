import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faChartPie, faMoneyBill, faWallet } from '@/shared/icons'

function SkeletonBar({ className = '' }: { readonly className?: string }): ReactElement {
  return <span className={`portfolio-skeleton__bar ${className}`.trim()} aria-hidden />
}

function SkeletonLabel({ icon }: { readonly icon: typeof faWallet }): ReactElement {
  return (
    <span className="portfolio-balances__label portfolio-skeleton__label">
      <FontAwesomeIcon icon={icon} className="portfolio-balances__icon" aria-hidden />
      <SkeletonBar className="portfolio-skeleton__bar--label" />
    </span>
  )
}

export function PortfolioBalancesSkeleton(): ReactElement {
  return (
    <section
      className="portfolio-balances portfolio-skeleton"
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando resumen de saldos"
    >
      <div className="portfolio-balances__strip">
        <div className="portfolio-balances__item">
          <SkeletonLabel icon={faWallet} />
          <SkeletonBar className="portfolio-skeleton__bar--amount" />
          <SkeletonBar className="portfolio-skeleton__bar--hint" />
        </div>
        <div className="portfolio-balances__divider" aria-hidden />
        <div className="portfolio-balances__item portfolio-balances__item--secondary">
          <SkeletonLabel icon={faMoneyBill} />
          <SkeletonBar className="portfolio-skeleton__bar--metric-value" />
          <SkeletonBar className="portfolio-skeleton__bar--hint" />
        </div>
        <div className="portfolio-balances__divider" aria-hidden />
        <div className="portfolio-balances__item portfolio-balances__item--secondary">
          <SkeletonLabel icon={faChartPie} />
          <SkeletonBar className="portfolio-skeleton__bar--metric-value" />
          <SkeletonBar className="portfolio-skeleton__bar--hint" />
        </div>
      </div>
    </section>
  )
}