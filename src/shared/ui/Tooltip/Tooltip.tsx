import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { faCircleInfo } from '@/shared/icons'
import { classNames } from '../classNames'
import './Tooltip.scss'

export interface TooltipProps {
  readonly content: string
  readonly triggerLabel: string
}

interface TooltipCoords {
  readonly top: number
  readonly left: number
}

function readTriggerCoords(trigger: HTMLButtonElement): TooltipCoords {
  const rect = trigger.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left + rect.width / 2,
  }
}

export function Tooltip({ content, triggerLabel }: TooltipProps): ReactElement {
  const tooltipId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<TooltipCoords>({ top: 0, left: 0 })

  const syncPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (trigger === null) {
      return
    }
    setCoords(readTriggerCoords(trigger))
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      return
    }
    syncPosition()
  }, [open, syncPosition])

  useEffect(() => {
    if (!open) {
      return
    }

    function onReposition(): void {
      syncPosition()
    }

    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, syncPosition])

  const bubble =
    open && typeof document !== 'undefined'
      ? createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            className="tooltip__bubble tooltip__bubble--fixed"
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {content}
          </span>,
          document.body,
        )
      : null

  return (
    <span className={classNames('tooltip', open ? 'tooltip--open' : undefined)}>
      <button
        ref={triggerRef}
        type="button"
        className="tooltip__trigger"
        aria-label={triggerLabel}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => {
          setOpen(true)
        }}
        onMouseLeave={() => {
          setOpen(false)
        }}
        onFocus={() => {
          setOpen(true)
        }}
        onBlur={() => {
          setOpen(false)
        }}
      >
        <FontAwesomeIcon icon={faCircleInfo} className="tooltip__icon" aria-hidden />
      </button>
      {bubble}
    </span>
  )
}