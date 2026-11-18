import type { ReactElement } from 'react'
import { readEnv } from '@/shared/config/env'
import { formatInstrumentsPollInterval } from '@/shared/lib/formatInstrumentsPollInterval'
import { Tooltip } from '@/shared/ui'
import type { InstrumentSortColumn, InstrumentTableSort } from '../../domain/table/instrumentTableList'
import { InstrumentsTableSortButton } from './InstrumentsTableSortButton'

export function InstrumentsTablePriceHeader({
  sort,
  onSort,
}: {
  readonly sort: InstrumentTableSort
  readonly onSort: (column: InstrumentSortColumn) => void
}): ReactElement {
  const { instrumentsPollMs } = readEnv()
  const intervalLabel = formatInstrumentsPollInterval(instrumentsPollMs)

  return (
    <div className="instruments__price-header">
      <InstrumentsTableSortButton label="Precio" column="price" sort={sort} align="end" onSort={onSort} />
      <Tooltip
        triggerLabel="Información sobre la actualización de precios"
        content={`Los precios del mercado se sincronizan automáticamente cada ${intervalLabel}.`}
      />
    </div>
  )
}