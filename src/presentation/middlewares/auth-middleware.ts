import {
  AccessDeniedError,
  type HttpResponse,
  type LoadAccountByToken,
  type Middleware,
  forbidden,
  serverError,
  success
} from './protocols'

export class AuthMiddleware implements Middleware<AuthMiddleware.Request> {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  public async handle ({ accessToken }: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      if (!accessToken) return forbidden(new AccessDeniedError())
      const account = await this.loadAccountByToken.load({ token: accessToken, role: this.role })
      if (!account) return forbidden(new AccessDeniedError())
      return success({ accountId: account.id })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
