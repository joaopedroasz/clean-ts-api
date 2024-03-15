export type HttpResponse = {
  statusCode: number
  body?: Record<string, unknown> | Error
}

export type HttpRequest = {
  body?: Record<string, unknown>
  headers?: Record<string, unknown>
  params?: Record<string, unknown>
  accountId?: string
}
