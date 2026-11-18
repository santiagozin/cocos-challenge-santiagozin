import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import './Toast.scss'

export type ToastTone = 'error' | 'info' | 'success'

interface ToastItem {
  readonly id: string
  readonly message: string
  readonly tone: ToastTone
}

interface ToastContextValue {
  readonly showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 4500

function createToastId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${String(Date.now())}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }: { readonly children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'error') => {
      const id = createToastId()
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => {
        dismissToast(id)
      }, TOAST_DURATION_MS)
    },
    [dismissToast],
  )

  const value = useMemo((): ToastContextValue => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-host" aria-live="assertive" aria-relevant="additions">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={toast.tone === 'error' ? 'toast toast--error' : 'toast'}
            role="alert"
          >
            <p className="toast__message">{toast.message}</p>
            <button
              type="button"
              className="toast__close"
              aria-label="Cerrar aviso"
              onClick={() => {
                dismissToast(toast.id)
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}