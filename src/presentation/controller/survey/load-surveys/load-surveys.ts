import {
  type LoadSurveys,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  success
} from './protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return success(surveys)
  }
}
