import type { AppEnv } from '../config/env'
import { ApiError } from './apiError'
import { apiGet, buildApiHeaders } from './httpClient'

const env: AppEnv = {
  apiBaseUrl: 'https://dummy-api-topaz.vercel.app',
  candidateId: 'candidate-1',
  enableBugs: 'off',
  requestTimeoutMs: 5_000,
  instrumentsPollMs: 10_000,
}

describe('buildApiHeaders', () => {
  it('sends the bug level and the candidate id', () => {
    const headers = buildApiHeaders(env)

    expect(headers.get('X-Enable-Bugs')).toBe('off')
    expect(headers.get('X-Candidate-Id')).toBe('candidate-1')
    expect(headers.get('Accept')).toBe('application/json')
  })

  it('omits the candidate id when it is empty', () => {
    const headers = buildApiHeaders({ ...env, candidateId: '' })

    expect(headers.get('X-Candidate-Id')).toBeNull()
  })
})

describe('apiGet', () => {
  it('rejects a path outside the API without calling fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await expect(apiGet('//evil.example', () => null)).rejects.toBeInstanceOf(ApiError)
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })
})
