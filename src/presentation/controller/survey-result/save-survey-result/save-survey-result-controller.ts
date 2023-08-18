import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type LoadSurveyById
} from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
  }
}
