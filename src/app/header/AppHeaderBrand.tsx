import type { MouseEvent, ReactElement } from 'react'
import logoSrc from '@/assets/logo.png'

interface AppHeaderBrandProps {
  readonly onReload: () => void
}

function shouldHandleBrandClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function AppHeaderBrand({ onReload }: AppHeaderBrandProps): ReactElement {
  function onBrandClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (!shouldHandleBrandClick(event)) {
      return
    }

    event.preventDefault()
    onReload()
  }

  return (
    <a className="app-header__brand" href="/" aria-label="Cocos" onClick={onBrandClick}>
      <img
        className="app-header__logo"
        src={logoSrc}
        width={48}
        height={48}
        alt=""
        decoding="async"
      />
    </a>
  )
}
