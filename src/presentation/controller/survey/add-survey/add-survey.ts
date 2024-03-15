import {
  type Validation,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  badRequest,
  type AddSurvey,
  serverError,
  noContent
} from './protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body) return badRequest(new Error('Missing body'))
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) return badRequest(validationError)

      const { question, answers } = httpRequest.body as { question: string, answers: Array<{ image: string, answer: string }> }
      await this.addSurvey.add({
        answers,
        question,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
