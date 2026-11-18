import type { ReactElement } from 'react'

const percentFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function PortfolioWeightBar({ percent }: { readonly percent: number | null }): ReactElement {
  if (percent === null) {
    return (
      <div className="portfolio-weight">
        <span className="portfolio-weight__track" aria-hidden>
          <span className="portfolio-weight__fill" style={{ width: '0%' }} />
        </span>
        <span className="portfolio-weight__label portfolio-weight__label--flat">—</span>
      </div>
    )
  }

  const width = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="portfolio-weight">
      <span className="portfolio-weight__track" aria-hidden>
        <span className="portfolio-weight__fill" style={{ width: `${width}%` }} />
      </span>
      <span className="portfolio-weight__label">{percentFormatter.format(percent)}%</span>
    </div>
  )
}