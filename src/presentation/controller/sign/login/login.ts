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
      const body = httpRequest.body as { email: string, password: string }
      const validationError = this.validation.validate(body)
      if (validationError) return badRequest(validationError)

      const { email, password } = httpRequest.body as { email: string, password: string }
      const authentication = await this.authentication.auth({ email, password })
      if (!authentication) return unauthorized()

      return success(authentication)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
