import type { ReactElement } from 'react'
import { formatSignedPercent, priceDirection, type PriceDirection } from '@/shared/lib/format'
import { priceReturnPercent } from '../../domain/instrument.calculations'
import { buildSparklinePath, SPARKLINE_LAYOUT } from '../../domain/instrumentSparkline'
import './InstrumentSparkline.scss'

interface InstrumentSparklineProps {
  readonly lastPrice: number
  readonly closePrice: number
  readonly variantSeed?: number
  readonly className?: string
  readonly compact?: boolean
}

function resolveDirection(lastPrice: number, closePrice: number): PriceDirection | null {
  const change = priceReturnPercent(lastPrice, closePrice)
  if (change === null) {
    return null
  }

  return priceDirection(change)
}

export function InstrumentSparkline({
  lastPrice,
  closePrice,
  variantSeed = 0,
  className,
  compact = false,
}: InstrumentSparklineProps): ReactElement {
  const change = priceReturnPercent(lastPrice, closePrice)
  const direction = resolveDirection(lastPrice, closePrice)
  const path = buildSparklinePath(closePrice, lastPrice, variantSeed)

  if (direction === null || path === null || change === null) {
    return (
      <span
        className={[
          'instrument-sparkline',
          'instrument-sparkline--flat',
          compact ? 'instrument-sparkline--compact' : undefined,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden
      >
        —
      </span>
    )
  }

  const label = `Variación ${formatSignedPercent(change)}`

  return (
    <span
      className={[
        'instrument-sparkline',
        `instrument-sparkline--${direction}`,
        `instrument-sparkline--tone-${variantSeed % 5}`,
        compact ? 'instrument-sparkline--compact' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label={label}
    >
      <svg
        className="instrument-sparkline__svg"
        viewBox={`0 0 ${SPARKLINE_LAYOUT.width} ${SPARKLINE_LAYOUT.height}`}
        aria-hidden
      >
        <path className="instrument-sparkline__path" d={path} />
      </svg>
    </span>
  )
}