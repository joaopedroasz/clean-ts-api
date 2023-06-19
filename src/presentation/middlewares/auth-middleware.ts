import { type LoadAccountByToken } from '../../domain/use-cases'
import { AccessDeniedError } from '../errors'
import { forbidden, success } from '../helpers/http/http'
import { type HttpRequest, type HttpResponse } from '../protocols'
import { type Middleware } from '../protocols/middeware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return forbidden(new AccessDeniedError())

    const account = await this.loadAccountByToken.load(accessToken)
    if (!account) return forbidden(new AccessDeniedError())

    return success({ accountId: account.id })
  }
}
