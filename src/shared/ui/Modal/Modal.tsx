import { useId, useRef, type ReactElement, type ReactNode } from 'react'
import { Button } from '../Button/Button'
import { useModalLifecycle } from './useModalLifecycle'
import './Modal.scss'

interface ModalProps {
  readonly title: string
  readonly open: boolean
  readonly onClose: () => void
  readonly children: ReactNode
}

export function Modal({ title, open, onClose, children }: ModalProps): ReactElement | null {
  const titleId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  useModalLifecycle(open, onClose, containerRef)

  if (!open) {
    return null
  }

  return (
    <div className="modal" ref={containerRef}>
      <button
        type="button"
        className="modal__backdrop"
        aria-label="Cerrar diálogo"
        onClick={onClose}
      />
      <div className="modal__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <Button variant="ghost" data-modal-close onClick={onClose}>
            Cerrar
          </Button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
