import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { memo, type ReactElement } from 'react'
import { faMagnifyingGlass, faPlugCircleExclamation } from '@/shared/icons'
import { Button } from '@/shared/ui'
import type { InstrumentsPageView } from '../../domain/instrumentsPageView'
import { InstrumentsTable } from '../instrumentsTable/InstrumentsTable'
import { InstrumentsTableSkeleton } from '../instrumentsTable/InstrumentsTableSkeleton'

function InstrumentsCatalogError({
  message,
  onRetry,
}: {
  readonly message: string
  readonly onRetry: () => void
}): ReactElement {
  return (
    <div className="instruments__content instruments__content--separated">
      <div className="instruments__error" role="alert" aria-live="assertive">
        <FontAwesomeIcon icon={faPlugCircleExclamation} className="instruments__error-icon" aria-hidden />
        <h3 className="instruments__error-title">No pudimos cargar los instrumentos</h3>
        <p className="instruments__error-text">{message}</p>
        <Button type="button" className="instruments__error-action" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    </div>
  )
}

function InstrumentsCatalogMessage({
  view,
  onRetryCatalog,
}: {
  readonly view: Extract<InstrumentsPageView, { kind: 'message' }>
  readonly onRetryCatalog: () => void
}): ReactElement {
  if (view.variant === 'search-empty' && view.query !== undefined) {
    return (
      <div className="instruments__content">
        <div className="instruments__empty" role="status" aria-live="polite">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="instruments__empty-icon" aria-hidden />
          <p className="instruments__empty-title">Sin coincidencias</p>
          <p className="instruments__empty-text">
            No encontramos instrumentos para <strong>{view.query}</strong>.
          </p>
          <p className="instruments__empty-hint">Probá con el ticker o parte del nombre.</p>
        </div>
      </div>
    )
  }

  if (view.tone === 'error' && view.variant === 'catalog-error') {
    return <InstrumentsCatalogError message={view.text} onRetry={onRetryCatalog} />
  }

  return (
    <div className="instruments__content instruments__content--separated">
      <p
        className={
          view.tone === 'error'
            ? 'instruments__status instruments__status--error'
            : 'instruments__status'
        }
        role="status"
      >
        {view.text}
      </p>
    </div>
  )
}

export interface InstrumentsCatalogSectionProps {
  readonly view: InstrumentsPageView
  readonly pricesRefreshing: boolean
  readonly onRetryCatalog: () => void
}

function InstrumentsCatalogSectionComponent({
  view,
  pricesRefreshing,
  onRetryCatalog,
}: InstrumentsCatalogSectionProps): ReactElement {
  switch (view.kind) {
    case 'skeleton':
      return <InstrumentsTableSkeleton />
    case 'message':
      return <InstrumentsCatalogMessage view={view} onRetryCatalog={onRetryCatalog} />
    case 'table':
      return (
        <div className="instruments__content">
          <InstrumentsTable instruments={view.instruments} pricesRefreshing={pricesRefreshing} />
        </div>
      )
  }
}

export const InstrumentsCatalogSection = memo(InstrumentsCatalogSectionComponent)