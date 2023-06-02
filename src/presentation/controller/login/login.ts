import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { type HttpRequest, type HttpResponse, type Controller } from '../../protocols'

export class LoginController implements Controller {
  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) { return badRequest(new MissingParamError('email')) }
    if (!httpRequest.body.password) { return badRequest(new MissingParamError('password')) }
  }
}