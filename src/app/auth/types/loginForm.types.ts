export type LoginSuccessPhase = 'loading' | 'welcome'

export type LoginField = 'email' | 'password'

export type LoginFlowPhase = 'form' | LoginSuccessPhase

export interface LoginFormBlurState {
  readonly email: boolean
  readonly password: boolean
}

export interface LoginFormState {
  readonly email: string
  readonly password: string
  readonly blurred: LoginFormBlurState
  readonly passwordAuthError?: string
}

export type LoginFormAction =
  | { readonly type: 'field_changed'; readonly field: LoginField; readonly value: string }
  | { readonly type: 'field_blurred'; readonly field: LoginField }
  | { readonly type: 'auth_failed' }

export interface LoginFormViewModel {
  readonly email: string
  readonly password: string
  readonly emailError?: string
  readonly passwordError?: string
  readonly canSubmit: boolean
  readonly flowPhase: LoginFlowPhase
  readonly onFieldChange: (field: LoginField, value: string) => void
  readonly onFieldBlur: (field: LoginField) => void
  readonly onSubmit: () => void
}

export const LOGIN_FORM_INITIAL_STATE: LoginFormState = {
  email: '',
  password: '',
  blurred: { email: false, password: false },
}