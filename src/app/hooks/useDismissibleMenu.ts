import { useEffect, useRef, type RefObject } from 'react'

export function useDismissibleMenu(
  open: boolean,
  onDismiss: () => void,
  rootRef: RefObject<HTMLElement | null>,
): void {
  const onDismissRef = useRef(onDismiss)

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(event: PointerEvent): void {
      if (rootRef.current?.contains(event.target as Node)) {
        return
      }

      onDismissRef.current()
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onDismissRef.current()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, rootRef])
}
