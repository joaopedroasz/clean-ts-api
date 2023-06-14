import {
  type Validation,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  badRequest
} from './protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body)
    if (validationError) return badRequest(validationError)
  }
}
