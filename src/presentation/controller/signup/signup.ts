import {
  type Controller,
  type EmailValidator,
  type HttpRequest,
  type HttpResponse,
  type AddAccount,
  InvalidParamError,
  badRequest,
  success,
  serverError,
  type Validation
} from './protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { password, email, name } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))
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
