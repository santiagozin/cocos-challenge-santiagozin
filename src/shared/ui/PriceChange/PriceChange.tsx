import type { ReactElement } from 'react'
import { formatArs, formatSignedPercent, priceDirection } from '@/shared/lib/format'
import './PriceChange.scss'

interface PriceChangeProps {
  readonly amount: number
  readonly percent: number
}

export function PriceChange({ amount, percent }: PriceChangeProps): ReactElement {
  const direction = priceDirection(percent)

  return (
    <p className="price-change">
      <span className="price-change__amount">{formatArs(amount)}</span>
      <span className={`price-change__percent price-change__percent--${direction}`}>
        {formatSignedPercent(percent)}
      </span>
    </p>
  )
}
