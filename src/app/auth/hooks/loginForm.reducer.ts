import {
  LOGIN_FORM_INITIAL_STATE,
  type LoginFormAction,
  type LoginFormState,
} from '../types/loginForm.types'

const AUTH_PASSWORD_ERROR = 'Usuario o contraseña incorrectos'

export { AUTH_PASSWORD_ERROR }

function withoutPasswordAuthError(state: LoginFormState): LoginFormState {
  if (state.passwordAuthError === undefined) {
    return state
  }

  const { passwordAuthError: _removed, ...rest } = state
  return rest
}

export function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case 'field_changed':
      if (action.field === 'password') {
        return { ...withoutPasswordAuthError(state), password: action.value }
      }
      return { ...state, email: action.value }
    case 'field_blurred':
      return {
        ...state,
        blurred: { ...state.blurred, [action.field]: true },
      }
    case 'auth_failed':
      return {
        ...state,
        password: '',
        passwordAuthError: AUTH_PASSWORD_ERROR,
        blurred: { ...state.blurred, password: true },
      }
    default:
      return state
  }
}

export const loginFormInitialState = LOGIN_FORM_INITIAL_STATE