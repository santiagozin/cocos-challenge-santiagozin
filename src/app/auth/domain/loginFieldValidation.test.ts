import { describe, expect, it } from 'vitest'
import {
  hasLoginFieldErrors,
  validateLoginEmail,
  validateLoginFields,
  validateLoginPassword,
} from './loginFieldValidation'

describe('validateLoginEmail', () => {
  it('accepts valid demo email', () => {
    expect(validateLoginEmail('demo@cocos.capital')).toBeUndefined()
  })

  it('rejects partial email', () => {
    expect(validateLoginEmail('persona@cocos')).toBe('Ingresá un email con formato completo')
  })

  it('rejects text without valid email shape', () => {
    expect(validateLoginEmail('dasdasda')).toBe('Ingresá un email con formato completo')
  })
})

describe('validateLoginPassword', () => {
  it('accepts demo password', () => {
    expect(validateLoginPassword('cocos-demo')).toBeUndefined()
  })
})

describe('validateLoginFields', () => {
  it('accepts valid demo credentials', () => {
    const errors = validateLoginFields('demo@cocos.capital', 'cocos-demo')
    expect(hasLoginFieldErrors(errors)).toBe(false)
  })
})