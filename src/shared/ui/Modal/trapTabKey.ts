const FOCUSABLE_SELECTOR = [
  'button:not(:disabled)',
  '[href]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function trapTabKey(container: HTMLElement, event: KeyboardEvent): void {
  const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (first === undefined || last === undefined) {
    return
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
    return
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
