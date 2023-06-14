import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type AddAccount,
  badRequest,
  success,
  serverError,
  type Validation,
  type Authentication,
  forbidden,
  EmailInUseError
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
      const addedAccount = await this.addAccount.add({
        email,
        name,
        password
      })
      if (!addedAccount) return forbidden(new EmailInUseError())
      const accessToken = await this.authentication.auth({ email, password })
      return success({ accessToken })
    } catch (error) {
      console.log(error)

      return serverError(error as Error)
    }
  }
}
