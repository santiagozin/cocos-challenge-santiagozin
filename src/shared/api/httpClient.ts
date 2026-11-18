import { readEnv, type AppEnv } from '../config/env'
import { ApiError } from './apiError'
import { isRecord, readString } from './guards'

interface RequestOptions {
  readonly method: 'GET' | 'POST'
  readonly body?: unknown
  readonly signal?: AbortSignal
}

export function buildApiHeaders(env: AppEnv): Headers {
  const headers = new Headers({
    Accept: 'application/json',
    'X-Enable-Bugs': env.enableBugs,
  })

  if (env.candidateId.length > 0) {
    headers.set('X-Candidate-Id', env.candidateId)
  }

  return headers
}

function assertRelativeApiPath(path: string): void {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('..')) {
    throw new ApiError(0, 'Invalid API path')
  }
}

function withTimeout(signal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  if (signal === undefined) {
    return timeoutSignal
  }

  return AbortSignal.any([signal, timeoutSignal])
}

async function request<T>(
  path: string,
  parse: (value: unknown) => T,
  options: RequestOptions,
): Promise<T> {
  assertRelativeApiPath(path)
  const env = readEnv()
  const url = new URL(path, env.apiBaseUrl)
  if (url.origin !== env.apiBaseUrl) {
    throw new ApiError(0, 'Invalid API path')
  }

  const headers = buildApiHeaders(env)
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body === undefined ? null : JSON.stringify(options.body),
      signal: withTimeout(options.signal, env.requestTimeoutMs),
    })
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(0)
  }

  if (!response.ok) {
    const detail = await readSafeApiDetail(response)
    throw detail === undefined
      ? new ApiError(response.status)
      : new ApiError(response.status, 'Request failed', detail)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(response.status)
  }

  return parse(payload)
}

const SAFE_API_DETAIL = /^[A-Za-z][A-Za-z ]{0,60}$/

async function readSafeApiDetail(response: Response): Promise<string | undefined> {
  try {
    const payload: unknown = await response.json()
    if (!isRecord(payload)) {
      return undefined
    }

    const detail = readString(payload, 'error')
    if (detail === undefined || !SAFE_API_DETAIL.test(detail)) {
      return undefined
    }

    return detail
  } catch {
    return undefined
  }
}

function withSignal(
  method: RequestOptions['method'],
  signal: AbortSignal | undefined,
  body?: unknown,
): RequestOptions {
  const options: RequestOptions = body === undefined ? { method } : { method, body }
  if (signal === undefined) {
    return options
  }

  return { ...options, signal }
}

export function apiGet<T>(
  path: string,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
): Promise<T> {
  return request(path, parse, withSignal('GET', signal))
}

export function apiPost<T>(
  path: string,
  body: unknown,
  parse: (value: unknown) => T,
  signal?: AbortSignal,
): Promise<T> {
  return request(path, parse, withSignal('POST', signal, body))
}
