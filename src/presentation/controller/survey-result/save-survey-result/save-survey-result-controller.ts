import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type LoadSurveyById,
  forbidden,
  InvalidParamError,
  serverError
} from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  public async handle ({ params: { surveyId }, body: { answer } }: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(({ answer }) => answer)
      const providedAnswerWasLoaded = answers.includes(answer)
      if (!providedAnswerWasLoaded) return forbidden(new InvalidParamError('answer'))
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
