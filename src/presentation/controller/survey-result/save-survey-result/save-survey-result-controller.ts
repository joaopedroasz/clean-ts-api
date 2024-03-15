import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type LoadSurveyById,
  forbidden,
  InvalidParamError,
  serverError,
  type SaveSurveyResult,
  success
} from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request as { accountId: string }
      const { surveyId } = request.params as { surveyId: string }
      const { answer } = request.body as { answer: string }
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(({ answer }) => answer)
      const providedAnswerWasLoaded = answers.includes(answer)
      if (!providedAnswerWasLoaded) return forbidden(new InvalidParamError('answer'))
      if (!accountId) return forbidden(new InvalidParamError('accountId'))
      const savedResult = await this.saveSurveyResult.save({ accountId, surveyId, answer, date: new Date() })
      return success(savedResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
