import {
  type Controller,
  type Authentication,
  type HttpResponse,
  badRequest,
  unauthorized,
  serverError,
  success,
  type Validation
} from './protocols'

export class LoginController implements Controller<LoginController.Request> {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  public async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request)
      if (validationError) return badRequest(validationError)

      const { email, password } = request
      const authentication = await this.authentication.auth({ email, password })
      if (!authentication) return unauthorized()

      return success(authentication)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
