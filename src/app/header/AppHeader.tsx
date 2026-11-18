import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useId, useRef, useState, type ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { faBars, faXmark } from '@/shared/icons'
import { Button } from '@/shared/ui'
import { classNames } from '@/shared/ui/classNames'
import { AppHeaderBrand } from './AppHeaderBrand'
import { AppUserMenu } from '../userMenu/AppUserMenu'
import { ROUTES } from '../router/paths'
import { useDismissibleMenu } from '@/app/hooks/useDismissibleMenu'

interface AppHeaderProps {
  readonly username: string
  readonly onReload: () => void
  readonly onLogout: () => void
}

function navClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? 'app-header__link app-header__link--active' : 'app-header__link'
}

export function AppHeader({ username, onReload, onLogout }: AppHeaderProps): ReactElement {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const navId = useId()

  function closeMenu(): void {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useDismissibleMenu(open, closeMenu, rootRef)

  return (
    <div className="app-header__inner" ref={rootRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        className="app-header__icon-button app-header__menu-button"
        aria-label="Menú de navegación"
        aria-expanded={open}
        aria-controls={navId}
        onClick={() => {
          setOpen((isOpen) => !isOpen)
        }}
      >
        <FontAwesomeIcon
          className="app-header__icon"
          icon={open ? faXmark : faBars}
          aria-hidden
        />
      </Button>
      <div className="app-header__start">
        <AppHeaderBrand onReload={onReload} />
      </div>
      <nav
        id={navId}
        className={classNames('app-header__nav', open ? 'app-header__nav--open' : undefined)}
        aria-label="Principal"
      >
        <NavLink className={navClassName} to={ROUTES.instruments} onClick={() => setOpen(false)}>
          Instrumentos
        </NavLink>
        <NavLink className={navClassName} to={ROUTES.portfolio} onClick={() => setOpen(false)}>
          Portfolio
        </NavLink>
      </nav>
      <AppUserMenu username={username} onLogout={onLogout} />
    </div>
  )
}
