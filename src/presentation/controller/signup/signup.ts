import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type AddAccount,
  badRequest,
  success,
  serverError,
  type Validation
} from './protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
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
      return success(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
