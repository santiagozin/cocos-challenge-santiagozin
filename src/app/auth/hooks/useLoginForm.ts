import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import { login } from '@/app/store/auth/authSlice'
import { useAppDispatch } from '@/app/store/hooks'
import { authenticateLogin } from '../domain/demoCredentials'
import {
  validateLoginFields,
  validateLoginEmail,
  validateLoginPassword,
} from '../domain/loginFieldValidation'
import type { LoginField, LoginFlowPhase, LoginFormViewModel } from '../types/loginForm.types'
import { loginFormInitialState, loginFormReducer } from './loginForm.reducer'

/** Login loading and welcome animation durations. */
const LOGIN_LOADING_MS = 800
const LOGIN_WELCOME_MS = 1600

function fieldError(blurred: boolean, message: string | undefined): string | undefined {
  return blurred && message !== undefined ? message : undefined
}

export function useLoginForm(): LoginFormViewModel {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [state, dispatchForm] = useReducer(loginFormReducer, loginFormInitialState)
  const [flowPhase, setFlowPhase] = useState<LoginFlowPhase>('form')

  /** Username of the user being logged in. */
  const pendingLoginRef = useRef<string | null>(null)
  const timersRef = useRef<number[]>([])

  const emailValidation = useMemo(() => validateLoginEmail(state.email), [state.email])
  const passwordValidation = useMemo(
    () => validateLoginPassword(state.password),
    [state.password],
  )

  /** Error message for the email field. */
  const emailError = fieldError(state.blurred.email, emailValidation)
  const passwordError =
    state.passwordAuthError ?? fieldError(state.blurred.password, passwordValidation)
  const canSubmit =
    flowPhase === 'form' &&
    emailValidation === undefined &&
    passwordValidation === undefined


  /** Clear all timers when the component unmounts. */
  useEffect(() => {
    return () => {
      for (const timerId of timersRef.current) {
        window.clearTimeout(timerId)
      }
    }
  }, [])

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timerId = window.setTimeout(callback, delayMs)
    timersRef.current.push(timerId)
  }, [])

  const onFieldChange = useCallback((field: LoginField, value: string) => {
    dispatchForm({ type: 'field_changed', field, value })
  }, [])

  const onFieldBlur = useCallback((field: LoginField) => {
    dispatchForm({ type: 'field_blurred', field })
  }, [])

  const onSubmit = useCallback(() => {
    if (!canSubmit) {
      return
    }

    const fieldErrors = validateLoginFields(state.email, state.password)
    if (fieldErrors.email !== undefined || fieldErrors.password !== undefined) {
      return
    }

    const authenticatedUsername = authenticateLogin(state.email, state.password)
    if (authenticatedUsername === null) {
      dispatchForm({ type: 'auth_failed' })
      return
    }

    pendingLoginRef.current = authenticatedUsername
    setFlowPhase('loading')

    schedule(() => {
      setFlowPhase('welcome')
      schedule(() => {
        const username = pendingLoginRef.current
        if (username === null) {
          return
        }

        dispatch(login({ username }))
        navigate(ROUTES.instruments)
      }, LOGIN_WELCOME_MS)
    }, LOGIN_LOADING_MS)
  }, [canSubmit, dispatch, navigate, schedule, state.email, state.password])

  return {
    email: state.email,
    password: state.password,
    flowPhase,
    ...(emailError !== undefined ? { emailError } : {}),
    ...(passwordError !== undefined ? { passwordError } : {}),
    canSubmit,
    onFieldChange,
    onFieldBlur,
    onSubmit,
  }
}

export type { LoginFormViewModel } from '../types/loginForm.types'