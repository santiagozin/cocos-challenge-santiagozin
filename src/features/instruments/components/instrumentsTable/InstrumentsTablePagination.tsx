import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faChevronLeft, faChevronRight } from '@/shared/icons'
import { buildTablePaginationItems } from '../../domain/table/instrumentTableList'

export function InstrumentsTablePagination({
  page,
  pageCount,
  total,
  onPageChange,
}: {
  readonly page: number
  readonly pageCount: number
  readonly total: number
  readonly onPageChange: (page: number) => void
}): ReactElement | null {
  if (total <= 0 || pageCount <= 1) {
    return null
  }

  const items = buildTablePaginationItems(page, pageCount)
  const showPrevious = page > 1
  const showNext = page < pageCount

  return (
    <nav className="instruments__pagination" aria-label="Paginación de instrumentos">
      <ul className="instruments__pagination-list">
        {showPrevious ? (
          <li className="instruments__pagination-item">
            <button
              type="button"
              className="instruments__page-nav"
              aria-label="Página anterior"
              onClick={() => {
                onPageChange(page - 1)
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="instruments__page-nav-icon" aria-hidden />
            </button>
          </li>
        ) : null}
        {items.map((item, index) => (
          <li
            key={item === 'ellipsis' ? `ellipsis-${index}` : item}
            className="instruments__pagination-item"
          >
            {item === 'ellipsis' ? (
              <span className="instruments__page-ellipsis" aria-hidden>
                …
              </span>
            ) : (
              <button
                type="button"
                className={
                  item === page
                    ? 'instruments__page-btn instruments__page-btn--active'
                    : 'instruments__page-btn'
                }
                aria-current={item === page ? 'page' : undefined}
                onClick={() => {
                  onPageChange(item)
                }}
              >
                {item}
              </button>
            )}
          </li>
        ))}
        {showNext ? (
          <li className="instruments__pagination-item">
            <button
              type="button"
              className="instruments__page-nav"
              aria-label="Página siguiente"
              onClick={() => {
                onPageChange(page + 1)
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} className="instruments__page-nav-icon" aria-hidden />
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}