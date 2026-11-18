import type { ReactElement, ReactNode } from 'react'
import { classNames } from '../classNames'
import './Badge.scss'

export type BadgeTone = 'neutral' | 'positive' | 'negative' | 'pending'

interface BadgeProps {
  readonly tone?: BadgeTone
  readonly children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps): ReactElement {
  return <span className={classNames('badge', `badge--${tone}`)}>{children}</span>
}
