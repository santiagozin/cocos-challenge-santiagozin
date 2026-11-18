import { memo, useEffect, useMemo, useState, type ReactElement } from 'react'
import { OrderModal } from '@/features/orders'
import { Button } from '@/shared/ui'
import { formatArs } from '@/shared/lib/format'
import { instrumentMark } from '@/shared/lib/instrumentMark'
import type { Instrument } from '../../domain/instrument.types'
import { isTradableInstrument } from '../../domain/instrumentTradability'
import {
  getTablePageCount,
  INSTRUMENTS_TABLE_PAGE_SIZE,
  paginateInstruments,
  sortInstruments,
  toggleInstrumentTableSort,
  type InstrumentSortColumn,
  type InstrumentTableSort,
} from '../../domain/table/instrumentTableList'
import { InstrumentReturnTrend, InstrumentReturnValue } from '../instrumentReturn/InstrumentReturn'
import { InstrumentsTablePagination } from './InstrumentsTablePagination'
import { InstrumentsTablePriceHeader } from './InstrumentsTablePriceHeader'
import { InstrumentsTableSortButton } from './InstrumentsTableSortButton'

const DEFAULT_SORT: InstrumentTableSort = { column: 'asset', direction: 'asc' }

function InstrumentRow({
  instrument,
  onTrade,
  pricesRefreshing,
}: {
  readonly instrument: Instrument
  readonly onTrade: (instrument: Instrument) => void
  readonly pricesRefreshing: boolean
}): ReactElement {
  const tradable = isTradableInstrument(instrument)

  function openTrade(): void {
    onTrade(instrument)
  }

  return (
    <tr
      className="instruments__row instruments__row--clickable"
      onClick={openTrade}
      title={`Operar ${instrument.ticker}`}
    >
      <td className="instruments__cell-asset">
        <div className="instruments__asset">
          <span className="instruments__mark" aria-hidden="true">
            {instrumentMark(instrument.ticker)}
          </span>
          <span className="instruments__asset-copy">
            <span className="instruments__name" title={instrument.name}>
              {instrument.name}
            </span>
            <span className="instruments__ticker" title={instrument.ticker}>
              {instrument.ticker}
            </span>
          </span>
        </div>
      </td>
      <td className="instruments__cell-price instruments__number" aria-busy={pricesRefreshing}>
        <span className="instruments__price-value">
          {pricesRefreshing ? (
            <span className="instruments-skeleton__bar instruments-skeleton__bar--price" aria-hidden />
          ) : (
            formatArs(instrument.last_price)
          )}
        </span>
      </td>
      <td className="instruments__cell-trend">
        <InstrumentReturnTrend
          lastPrice={instrument.last_price}
          closePrice={instrument.close_price}
          variantSeed={instrument.id}
        />
      </td>
      <td className="instruments__cell-change instruments__number">
        <span className="instruments__change-value">
          <InstrumentReturnValue lastPrice={instrument.last_price} closePrice={instrument.close_price} />
        </span>
      </td>
      <td className="instruments__cell-action instruments__action">
        <Button
          type="button"
          className="instruments__trade-btn"
          disabled={!tradable}
          title={tradable ? undefined : 'Este instrumento no se puede operar'}
          onClick={(event) => {
            event.stopPropagation()
            openTrade()
          }}
        >
          Operar
        </Button>
      </td>
    </tr>
  )
}

function InstrumentsTableComponent({
  instruments,
  pricesRefreshing,
}: {
  readonly instruments: readonly Instrument[]
  readonly pricesRefreshing: boolean
}): ReactElement {
  const [selected, setSelected] = useState<Instrument | null>(null)
  const [sort, setSort] = useState<InstrumentTableSort>(DEFAULT_SORT)
  const [page, setPage] = useState(1)

  const listKey = useMemo(() => instruments.map((item) => item.id).join(','), [instruments])

  useEffect(() => {
    setPage(1)
  }, [listKey])

  const sorted = useMemo(() => sortInstruments(instruments, sort), [instruments, sort])
  const pageCount = getTablePageCount(sorted.length, INSTRUMENTS_TABLE_PAGE_SIZE)
  const safePage = Math.min(page, pageCount)
  const pageItems = useMemo(
    () => paginateInstruments(sorted, safePage, INSTRUMENTS_TABLE_PAGE_SIZE),
    [safePage, sorted],
  )

  function onSort(column: InstrumentSortColumn): void {
    setSort((current) => toggleInstrumentTableSort(current, column))
    setPage(1)
  }

  return (
    <>
      <div className="instruments__table-area">
      <div className="instruments__table-panel">
        <div className="instruments__table-scroll" tabIndex={0} aria-label="Tabla de instrumentos, deslizá horizontalmente si no ves todas las columnas">
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
              <th
                scope="col"
                className="instruments__cell-asset"
                aria-sort={
                  sort.column === 'asset'
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <InstrumentsTableSortButton label="Activo" column="asset" sort={sort} onSort={onSort} />
              </th>
              <th
                scope="col"
                className="instruments__cell-price instruments__number"
                aria-sort={
                  sort.column === 'price'
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <InstrumentsTablePriceHeader sort={sort} onSort={onSort} />
              </th>
              <th scope="col" className="instruments__cell-trend">
                <span className="instruments__header-label instruments__header-label--center">Gráfico</span>
              </th>
              <th
                scope="col"
                className="instruments__cell-change instruments__number"
                aria-sort={
                  sort.column === 'change'
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                <div className="instruments__change-header">
                  <InstrumentsTableSortButton
                    label="Cambio"
                    column="change"
                    sort={sort}
                    align="end"
                    onSort={onSort}
                  />
                </div>
              </th>
              <th scope="col" className="instruments__cell-action instruments__action">
                <span className="instruments__sr-only">Acción</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((instrument) => (
              <InstrumentRow
                key={instrument.id}
                instrument={instrument}
                onTrade={setSelected}
                pricesRefreshing={pricesRefreshing}
              />
            ))}
          </tbody>
          </table>
        </div>
      </div>
      <InstrumentsTablePagination
        page={safePage}
        pageCount={pageCount}
        total={sorted.length}
        onPageChange={setPage}
      />
      </div>
      <OrderModal
        instrument={selected}
        open={selected !== null}
        onClose={() => {
          setSelected(null)
        }}
      />
    </>
  )
}

export const InstrumentsTable = memo(InstrumentsTableComponent)