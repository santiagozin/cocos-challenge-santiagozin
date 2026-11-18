import type { ReactElement } from 'react'

const SKELETON_ROWS = 8

function SkeletonCell({ wide = false }: { readonly wide?: boolean }): ReactElement {
  return (
    <span
      className={`instruments-skeleton__bar${wide ? ' instruments-skeleton__bar--wide' : ''}`}
      aria-hidden
    />
  )
}

function SkeletonRow(): ReactElement {
  return (
    <tr className="instruments-skeleton__row">
      <td className="instruments__cell-asset">
        <div className="instruments-skeleton__asset">
          <span className="instruments-skeleton__mark" aria-hidden />
          <span className="instruments-skeleton__text instruments__asset-copy">
            <SkeletonCell wide />
            <SkeletonCell />
          </span>
        </div>
      </td>
      <td className="instruments__cell-price instruments__number">
        <span className="instruments__price-value">
          <span className="instruments-skeleton__bar instruments-skeleton__bar--price" aria-hidden />
        </span>
      </td>
      <td className="instruments__cell-trend">
        <span className="instruments-skeleton__bar instruments-skeleton__bar--trend" aria-hidden />
      </td>
      <td className="instruments__cell-change instruments__number">
        <span className="instruments__change-value">
          <SkeletonCell />
        </span>
      </td>
      <td className="instruments__cell-action instruments__action">
        <span className="instruments-skeleton__bar instruments-skeleton__bar--action" aria-hidden />
      </td>
    </tr>
  )
}

export function InstrumentsTableSkeleton(): ReactElement {
  return (
    <div className="instruments__table-panel instruments-skeleton">
      <div
      className="instruments__table-scroll"
      role="status"
      aria-busy="true"
      aria-label="Cargando instrumentos. Podés deslizar horizontalmente para ver todas las columnas en pantallas chicas."
      tabIndex={0}
    >
      <table className="instruments__table">
        <colgroup>
          <col className="instruments__col-asset" />
          <col className="instruments__col-price" />
          <col className="instruments__col-trend" />
          <col className="instruments__col-change" />
          <col className="instruments__col-action" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="instruments__cell-asset">
              Activo
            </th>
            <th scope="col" className="instruments__cell-price instruments__number">
              Precio
            </th>
            <th scope="col" className="instruments__cell-trend">
              <span className="instruments__header-label instruments__header-label--center">Gráfico</span>
            </th>
            <th scope="col" className="instruments__cell-change instruments__number">
              Cambio
            </th>
            <th scope="col" className="instruments__cell-action instruments__action">
              <span className="instruments__sr-only">Acción</span>
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