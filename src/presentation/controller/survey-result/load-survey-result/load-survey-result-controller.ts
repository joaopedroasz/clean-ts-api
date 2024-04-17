import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params?.surveyId as string)
  }
}
