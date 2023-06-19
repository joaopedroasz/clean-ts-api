import {
  AccessDeniedError,
  type HttpRequest,
  type HttpResponse,
  type LoadAccountByToken,
  type Middleware,
  forbidden,
  serverError,
  success
} from './protocols'

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
