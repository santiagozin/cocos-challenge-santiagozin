import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useId, type ReactElement } from 'react'
import { faMagnifyingGlass } from '@/shared/icons'
import { SEARCH_QUERY_MAX_LENGTH } from '../../domain/search.constants'
import './SearchBox.scss'

export interface SearchBoxProps {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly isSearching?: boolean
  readonly disabled?: boolean
  readonly label?: string
  readonly placeholder?: string
  readonly inputName?: string
  readonly layout?: 'hero' | 'compact'
}

function SearchDots(): ReactElement {
  return (
    <span className="search-box__dots" role="status" aria-live="polite" aria-label="Buscando">
      <span className="search-box__dot" aria-hidden />
      <span className="search-box__dot" aria-hidden />
      <span className="search-box__dot" aria-hidden />
    </span>
  )
}

export function SearchBox({
  value,
  onChange,
  isSearching = false,
  disabled = false,
  label = 'Buscar por ticker o nombre',
  placeholder = 'Buscar',
  inputName = 'instrument-search',
  layout = 'hero',
}: SearchBoxProps): ReactElement {
  const fieldId = useId()
  const isBusy = value.trim().length > 0 && isSearching
  const isDisabled = disabled || isBusy
  const layoutClass = layout === 'compact' ? 'search-box--compact' : 'search-box--hero'

  return (
    <search
      className={
        isBusy
          ? `search-box ${layoutClass} search-box--busy`
          : disabled
            ? `search-box ${layoutClass} search-box--disabled`
            : `search-box ${layoutClass}`
      }
      aria-busy={isBusy}
    >
      <label className="search-box__label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="search-box__field">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-box__icon" aria-hidden />
        <input
          id={fieldId}
          className="search-box__input"
          type="search"
          name={inputName}
          placeholder={placeholder}
          autoComplete="off"
          maxLength={SEARCH_QUERY_MAX_LENGTH}
          value={value}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          onChange={(event) => {
            onChange(event.target.value)
          }}
        />
        {isBusy ? <SearchDots /> : null}
      </div>
    </search>
  )
}
