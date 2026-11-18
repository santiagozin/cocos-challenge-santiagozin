import { useCallback, useState, type ReactElement } from 'react'
import { OrderModal } from '@/features/orders'
import { InstrumentsCatalogSection } from '../components/instrumentsCatalogSection/InstrumentsCatalogSection'
import { InstrumentsToolbar } from '../components/instrumentsToolbar/InstrumentsToolbar'
import { InstrumentsWinnersSection } from '../components/instrumentsWinnersSection/InstrumentsWinnersSection'
import type { Instrument } from '../domain/instrument.types'
import { useInstrumentsPage } from '../hooks/useInstrumentsPage'
import './InstrumentsPage.scss'

export function InstrumentsPage(): ReactElement {
  const [orderInstrument, setOrderInstrument] = useState<Instrument | null>(null)
  const handleWinnerTrade = useCallback((instrument: Instrument) => {
    setOrderInstrument(instrument)
  }, [])
  const {
    searchQuery,
    setSearchQuery,
    searchBusy,
    selectedType,
    setSelectedType,
    availableTypes,
    filtersLoading,
    pricesRefreshing,
    view,
    catalogUnavailable,
    retryCatalog,
  } = useInstrumentsPage()

  return (
    <section className="instruments">
      <header className="instruments__hero">
        <h1 className="instruments__title">Explora el mercado</h1>
      </header>
      <InstrumentsToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchBusy={searchBusy}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        availableTypes={availableTypes}
        filtersLoading={filtersLoading}
        disabled={catalogUnavailable}
      />
      <InstrumentsWinnersSection onTrade={handleWinnerTrade} />
      <InstrumentsCatalogSection
        view={view}
        pricesRefreshing={pricesRefreshing}
        onRetryCatalog={retryCatalog}
      />
      <OrderModal
        instrument={orderInstrument}
        open={orderInstrument !== null}
        onClose={() => {
          setOrderInstrument(null)
        }}
      />
    </section>
  )
}