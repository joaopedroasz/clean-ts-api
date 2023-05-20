import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http'
import { type Controller } from '../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  public handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }
  }
}
