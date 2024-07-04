import { type HttpResponse } from './http'

export interface Middleware<Request = any> {
  handle: (httpRequest: Request) => Promise<HttpResponse>
}
