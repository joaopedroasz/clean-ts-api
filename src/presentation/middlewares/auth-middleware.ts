import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http'
import { type HttpRequest, type HttpResponse } from '../protocols'
import { type Middleware } from '../protocols/middeware'

export class AuthMiddleware implements Middleware {
  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
