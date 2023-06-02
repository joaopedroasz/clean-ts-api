import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'
import { type EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) { return badRequest(new MissingParamError('email')) }
    if (!httpRequest.body.password) { return badRequest(new MissingParamError('password')) }

    this.emailValidator.isValid(httpRequest.body.email)
  }
}
