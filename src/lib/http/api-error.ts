export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export class ApiError extends Error {
  public readonly statusCode: number
  public readonly code?: string
  public readonly errors?: Record<string, string[]>

  constructor(response: ApiErrorResponse, statusCode: number) {
    super(response.message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = response.code
    this.errors = response.errors
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401
  }

  get isForbidden(): boolean {
    return this.statusCode === 403
  }

  get isValidationError(): boolean {
    return this.statusCode === 422
  }
}
