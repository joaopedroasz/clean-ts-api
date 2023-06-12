import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type AddAccount,
  badRequest,
  success,
  serverError,
  type Validation,
  type Authentication
} from './protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { password, email, name } = httpRequest.body
      const account = await this.addAccount.add({
        email,
        name,
        password
      })
      await this.authentication.auth({ email, password })
      return success(account)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
