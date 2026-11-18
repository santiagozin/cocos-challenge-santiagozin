import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DEMO_EMAIL } from '../domain/demoCredentials'
import { useLoginForm } from './useLoginForm'

const mockNavigate = vi.fn()
const mockDispatch = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/app/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

vi.mock('@/app/store/auth/authSlice', () => ({
  login: (payload: { username: string }) => ({ type: 'login', payload }),
}))

describe('useLoginForm', () => {
  it('shows email error only after blur', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.onFieldChange('email', 'dasdasda')
    })
    expect(result.current.emailError).toBeUndefined()

    act(() => {
      result.current.onFieldBlur('email')
    })
    expect(result.current.emailError).toBe('Ingresá un email con formato completo')
  })

  it('does not enable submit until email format is complete', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.onFieldChange('email', 'persona@cocos')
      result.current.onFieldChange('password', 'cocos-demo')
    })

    expect(result.current.canSubmit).toBe(false)
  })

  it('shows password error below the field after auth failure', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.onFieldChange('email', DEMO_EMAIL)
      result.current.onFieldChange('password', 'wrong-password')
    })

    act(() => {
      result.current.onSubmit()
    })

    expect(result.current.password).toBe('')
    expect(result.current.passwordError).toBe('Usuario o contraseña incorrectos')
  })

  it('shows loader and welcome before redirecting on success', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.onFieldChange('email', DEMO_EMAIL)
      result.current.onFieldChange('password', 'cocos-demo')
    })

    act(() => {
      result.current.onSubmit()
    })

    expect(result.current.flowPhase).toBe('loading')

    act(() => {
      vi.advanceTimersByTime(800)
    })
    expect(result.current.flowPhase).toBe('welcome')

    act(() => {
      vi.advanceTimersByTime(1600)
    })
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/instruments')

    vi.useRealTimers()
  })
})