export type HttpResponse = {
  statusCode: number
  body?: Record<string, unknown> | Error
}
