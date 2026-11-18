import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faArrowRight, faArrowTrendDown, faArrowTrendUp } from '@/shared/icons'
import { formatSignedPercent, priceDirection, type PriceDirection } from '@/shared/lib/format'
import { priceReturnPercent } from '../../domain/instrument.calculations'
import { InstrumentSparkline } from '../instrumentSparkline/InstrumentSparkline'
import './InstrumentReturn.scss'

interface InstrumentReturnProps {
  readonly lastPrice: number
  readonly closePrice: number
}

const RETURN_ICON = {
  up: faArrowTrendUp,
  down: faArrowTrendDown,
  flat: faArrowRight,
} as const

interface ResolvedInstrumentReturn {
  readonly change: number
  readonly direction: PriceDirection
}

function resolveInstrumentReturn(lastPrice: number, closePrice: number): ResolvedInstrumentReturn | null {
  const change = priceReturnPercent(lastPrice, closePrice)
  if (change === null) {
    return null
  }

  return {
    change,
    direction: priceDirection(change),
  }
}

export function InstrumentReturnTrend({
  lastPrice,
  closePrice,
  variantSeed = 0,
}: InstrumentReturnProps & { readonly variantSeed?: number }): ReactElement {
  return (
    <InstrumentSparkline
      lastPrice={lastPrice}
      closePrice={closePrice}
      variantSeed={variantSeed}
      className="instrument-return__sparkline"
    />
  )
}

export function InstrumentReturnValue({
  lastPrice,
  closePrice,
}: InstrumentReturnProps): ReactElement {
  const resolved = resolveInstrumentReturn(lastPrice, closePrice)

  if (resolved === null) {
    return <span className="instrument-return__value instrument-return__value--flat">—</span>
  }

  return (
    <span className={`instrument-return__value instrument-return__value--${resolved.direction}`}>
      {formatSignedPercent(resolved.change)}
    </span>
  )
}

export function PerformanceTrend({
  percent,
  lastPrice,
  closePrice,
  variantSeed = 0,
}: {
  readonly percent: number | null
  readonly lastPrice: number
  readonly closePrice: number
  readonly variantSeed?: number
}): ReactElement {
  if (percent === null) {
    return (
      <InstrumentSparkline
        lastPrice={lastPrice}
        closePrice={closePrice}
        variantSeed={variantSeed}
        compact
        className="instrument-return__sparkline"
      />
    )
  }

  return (
    <InstrumentSparkline
      lastPrice={lastPrice}
      closePrice={closePrice}
      variantSeed={variantSeed}
      compact
      className="instrument-return__sparkline"
    />
  )
}

export function PerformanceValue({ percent }: { readonly percent: number | null }): ReactElement {
  if (percent === null) {
    return <span className="instrument-return__value instrument-return__value--flat">—</span>
  }

  const direction = priceDirection(percent)

  return (
    <span className={`instrument-return__value instrument-return__value--${direction}`}>
      {formatSignedPercent(percent)}
    </span>
  )
}

export function InstrumentReturn({ lastPrice, closePrice }: InstrumentReturnProps): ReactElement {
  const resolved = resolveInstrumentReturn(lastPrice, closePrice)
  if (resolved === null) {
    return <span className="instrument-return instrument-return--flat">—</span>
  }

  return (
    <span className={`instrument-return instrument-return--${resolved.direction}`}>
      <FontAwesomeIcon icon={RETURN_ICON[resolved.direction]} className="instrument-return__icon" aria-hidden />
      {formatSignedPercent(resolved.change)}
    </span>
  )
}