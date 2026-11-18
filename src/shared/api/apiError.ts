export class ApiError extends Error {
  readonly status: number
  readonly detail?: string

  constructor(status: number, message = 'Request failed', detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (detail !== undefined) {
      this.detail = detail
    }
  }
}
