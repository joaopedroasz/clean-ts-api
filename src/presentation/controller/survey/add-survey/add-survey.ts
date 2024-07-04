import {
  type Validation,
  type Controller,
  type HttpResponse,
  badRequest,
  type AddSurvey,
  serverError,
  noContent
} from './protocols'

export class AddSurveyController implements Controller<AddSurveyController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request)
      if (validationError) return badRequest(validationError)
      const { question, answers } = request
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

export namespace AddSurveyController {
  export type Request = {
    question: string
    answers: Array<{ image: string, answer: string }>
  }
}
