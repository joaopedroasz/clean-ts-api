import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) { return badRequest(new MissingParamError('email')) }
    if (!password) { return badRequest(new MissingParamError('password')) }

    const isValidEmail = this.emailValidator.isValid(email)
    if (!isValidEmail) { return badRequest(new InvalidParamError('email')) }
  }
}
