import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faChartPie, faMoneyBill, faWallet } from '@/shared/icons'
import { formatArs, formatSignedArs, priceDirection } from '@/shared/lib/format'
import { Tooltip } from '@/shared/ui'
import type { PortfolioSummary } from '../domain/portfolioSummary'

function gainClassName(amount: number | null): string {
  if (amount === null) {
    return 'portfolio-balances__gain portfolio-balances__gain--flat'
  }

  return `portfolio-balances__gain portfolio-balances__gain--${priceDirection(amount)}`
}

function gainMessage(summary: PortfolioSummary): string {
  if (summary.holdingsValue <= 0) {
    return 'Sin posiciones abiertas.'
  }

  if (summary.totalGain === null) {
    return 'Sin ganancia calculada'
  }

  return `Ganancia ${formatSignedArs(summary.totalGain)}`
}

export function PortfolioBalances({ summary }: { readonly summary: PortfolioSummary }): ReactElement {
  return (
    <section className="portfolio-balances" aria-labelledby="portfolio-balances-title">
      <h2 id="portfolio-balances-title" className="portfolio-balances__sr-only">
        Resumen de saldos
      </h2>

      <div className="portfolio-balances__strip">
        <div className="portfolio-balances__item">
          <span className="portfolio-balances__label">
            <FontAwesomeIcon icon={faWallet} className="portfolio-balances__icon" aria-hidden />
            Saldo total
          </span>
          <p className="portfolio-balances__amount">{formatArs(summary.totalPatrimony)}</p>
          <p className={gainClassName(summary.totalGain)}>{gainMessage(summary)}</p>
        </div>

        <div className="portfolio-balances__divider" aria-hidden />

        <div className="portfolio-balances__item portfolio-balances__item--secondary">
          <span className="portfolio-balances__label">
            <FontAwesomeIcon icon={faMoneyBill} className="portfolio-balances__icon" aria-hidden />
            Saldo
            <Tooltip
              triggerLabel="Información sobre el saldo disponible"
              content="Es el dinero que tenés libre para comprar instrumentos, sin incluir el valor de tus posiciones abiertas."
            />
          </span>
          <p className="portfolio-balances__amount">{formatArs(summary.cash)}</p>
          <p className="portfolio-balances__gain portfolio-balances__gain--placeholder" aria-hidden="true">
            &nbsp;
          </p>
        </div>

        <div className="portfolio-balances__divider" aria-hidden />

        <div className="portfolio-balances__item portfolio-balances__item--secondary">
          <span className="portfolio-balances__label">
            <FontAwesomeIcon icon={faChartPie} className="portfolio-balances__icon" aria-hidden />
            En instrumentos
          </span>
          <p className="portfolio-balances__amount">{formatArs(summary.holdingsValue)}</p>
          <p className="portfolio-balances__gain portfolio-balances__gain--placeholder" aria-hidden="true">
            &nbsp;
          </p>
        </div>
      </div>
    </section>
  )
}