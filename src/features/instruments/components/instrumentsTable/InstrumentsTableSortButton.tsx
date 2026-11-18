import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faSort, faSortDown, faSortUp } from '@/shared/icons'
import type { InstrumentSortColumn, InstrumentTableSort } from '../../domain/table/instrumentTableList'

export function InstrumentsTableSortButton({
  label,
  column,
  sort,
  align = 'start',
  onSort,
}: {
  readonly label: string
  readonly column: InstrumentSortColumn
  readonly sort: InstrumentTableSort
  readonly align?: 'start' | 'end'
  readonly onSort: (column: InstrumentSortColumn) => void
}): ReactElement {
  const isActive = sort.column === column
  const icon = !isActive ? faSort : sort.direction === 'asc' ? faSortUp : faSortDown
  return (
    <button
      type="button"
      className={`instruments__sort-btn instruments__sort-btn--${align}`}
      aria-label={isActive ? `${label}, orden ${sort.direction === 'asc' ? 'ascendente' : 'descendente'}` : `Ordenar por ${label}`}
      onClick={() => {
        onSort(column)
      }}
    >
      <span>{label}</span>
      <FontAwesomeIcon icon={icon} className="instruments__sort-icon" aria-hidden />
    </button>
  )
}