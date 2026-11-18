import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useId, useRef, useState, type ReactElement } from 'react'
import { faRightFromBracket, faUser } from '@/shared/icons'
import { Button } from '@/shared/ui'
import { useDismissibleMenu } from '@/app/hooks/useDismissibleMenu'

interface AppUserMenuProps {
  readonly username: string
  readonly onLogout: () => void
}

export function AppUserMenu({ username, onLogout }: AppUserMenuProps): ReactElement {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  function closeMenu(): void {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useDismissibleMenu(open, closeMenu, rootRef)

  return (
    <div className="app-user-menu" ref={rootRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        className="app-header__icon-button"
        aria-label="Menú de usuario"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((isOpen) => !isOpen)
        }}
      >
        <FontAwesomeIcon className="app-header__icon" icon={faUser} aria-hidden />
      </Button>
      {open ? (
        <div className="app-user-menu__panel" id={menuId} role="menu" aria-label="Cuenta">
          <p className="app-user-menu__username">{username}</p>
          <button type="button" className="app-user-menu__item" role="menuitem" onClick={onLogout}>
            <FontAwesomeIcon
              className="app-user-menu__item-icon"
              icon={faRightFromBracket}
              aria-hidden
            />
            Salir
          </button>
        </div>
      ) : null}
    </div>
  )
}
