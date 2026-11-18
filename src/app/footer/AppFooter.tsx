import type { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../router/paths'
import './AppFooter.scss'

function footerLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'app-footer__link app-footer__link--active' : 'app-footer__link'
}

export function AppFooter(): ReactElement {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__top">
          <div className="app-footer__brand">
            <span className="app-footer__name">Cocos</span>
            <span className="app-footer__tagline">Challenge Frontend</span>
          </div>
          <nav className="app-footer__nav" aria-label="Enlaces del sitio">
            <NavLink to={ROUTES.instruments} className={footerLinkClass}>
              Instrumentos
            </NavLink>
            <NavLink to={ROUTES.portfolio} className={footerLinkClass}>
              Portfolio
            </NavLink>
          </nav>
        </div>
        <p className="app-footer__legal">
          © {year} Santiago Zin.
        </p>
      </div>
    </footer>
  )
}