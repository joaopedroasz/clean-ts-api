import {
  type Controller,
  type Authentication,
  type HttpRequest,
  type HttpResponse,
  badRequest,
  unauthorized,
  serverError,
  success,
  type Validation
} from './protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorized()

      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
