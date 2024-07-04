import {
  type Controller,
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

export class SignUpController implements Controller<SignUpController.Request> {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      const { password, email, name } = request
      const isAddedAccount = await this.addAccount.add({
        email,
        name,
        password
      })
      if (!isAddedAccount) return forbidden(new EmailInUseError())
      const authentication = await this.authentication.auth({ email, password })
      return success(authentication)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
