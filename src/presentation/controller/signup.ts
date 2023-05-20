import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  public handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }
  }
}
