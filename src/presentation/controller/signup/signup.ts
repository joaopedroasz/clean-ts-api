import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse, type AddAccount } from './protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  public handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      const { password, passwordConfirmation, email, name } = httpRequest.body
      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))
      const account = this.addAccount.add({
        email,
        name,
        password
      })
      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}