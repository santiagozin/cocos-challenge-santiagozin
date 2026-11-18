import type { ReactElement } from 'react'

const SKELETON_ROWS = 6

function SkeletonBar({ className = '' }: { readonly className?: string }): ReactElement {
  return <span className={`portfolio-skeleton__bar ${className}`.trim()} aria-hidden />
}

function SkeletonRow(): ReactElement {
  return (
    <tr className="portfolio-skeleton__row">
      <td className="portfolio__cell-asset">
        <div className="portfolio__asset">
          <span className="portfolio-skeleton__mark" aria-hidden />
          <SkeletonBar className="portfolio-skeleton__bar--ticker" />
        </div>
      </td>
      <td className="portfolio__cell-balance">
        <div className="portfolio__stack">
          <SkeletonBar className="portfolio-skeleton__bar--stack-primary" />
          <SkeletonBar className="portfolio-skeleton__bar--stack-secondary" />
        </div>
      </td>
      <td className="portfolio__cell-price">
        <div className="portfolio__stack">
          <SkeletonBar className="portfolio-skeleton__bar--stack-primary" />
          <SkeletonBar className="portfolio-skeleton__bar--stack-secondary" />
        </div>
      </td>
      <td className="portfolio__cell-weight">
        <SkeletonBar className="portfolio-skeleton__bar--weight" />
      </td>
      <td className="portfolio__cell-return">
        <SkeletonBar className="portfolio-skeleton__bar--stack-primary" />
      </td>
      <td className="portfolio__cell-action">
        <SkeletonBar className="portfolio-skeleton__bar--action" />
      </td>
    </tr>
  )
}

export function PortfolioHoldingsTableSkeleton(): ReactElement {
  return (
    <div className="portfolio__table-panel portfolio-skeleton">
      <div
        className="portfolio__table-scroll"
        role="status"
        aria-busy="true"
        aria-label="Cargando posiciones del portfolio"
        tabIndex={0}
      >
        <table className="portfolio__table">
          <colgroup>
            <col className="portfolio__col-asset" />
            <col className="portfolio__col-balance" />
            <col className="portfolio__col-price" />
            <col className="portfolio__col-weight" />
            <col className="portfolio__col-return" />
            <col className="portfolio__col-action" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="portfolio__cell-asset">
                Activo
              </th>
              <th scope="col" className="portfolio__cell-balance">
                Saldo total
              </th>
              <th scope="col" className="portfolio__cell-price">
                Precio
              </th>
              <th scope="col" className="portfolio__cell-weight">
                % portfolio
              </th>
              <th scope="col" className="portfolio__cell-return">
                Ganancia
              </th>
              <th scope="col" className="portfolio__cell-action">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}