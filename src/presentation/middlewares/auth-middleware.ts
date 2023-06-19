import { type LoadAccountByToken } from '../../domain/use-cases'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, success } from '../helpers/http/http'
import { type HttpRequest, type HttpResponse } from '../protocols'
import { type Middleware } from '../protocols/middeware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return forbidden(new AccessDeniedError())

      const account = await this.loadAccountByToken.load({
        token: accessToken,
        role: this.role
      })
      if (!account) return forbidden(new AccessDeniedError())

      return success({ accountId: account.id })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
