import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  public handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) return badRequest(new MissingParamError('name'))
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))
  }
}
