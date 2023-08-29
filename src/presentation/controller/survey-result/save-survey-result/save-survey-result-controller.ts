import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type LoadSurveyById,
  forbidden,
  InvalidParamError
} from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  public async handle ({ params: { surveyId } }: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
  }
}
