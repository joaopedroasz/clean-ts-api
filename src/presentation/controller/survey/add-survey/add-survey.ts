import {
  type Validation,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  badRequest,
  type AddSurvey
} from './protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(httpRequest.body)
    if (validationError) return badRequest(validationError)

    const { question, answers } = httpRequest.body
    await this.addSurvey.add({
      answers,
      question
    })
  }
}
