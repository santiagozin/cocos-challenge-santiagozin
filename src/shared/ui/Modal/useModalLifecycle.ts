import { useEffect, useRef, type RefObject } from 'react'
import { trapTabKey } from './trapTabKey'

export function useModalLifecycle(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLDivElement | null>,
): void {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }

    const previouslyFocused = document.activeElement
    const container = containerRef.current
    container?.querySelector<HTMLElement>('[data-modal-close]')?.focus()

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }

      if (event.key === 'Tab' && container) {
        trapTabKey(container, event)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [containerRef, open])
}
