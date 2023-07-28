import {
  type LoadSurveys,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  success,
  serverError,
  noContent
} from './protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (!surveys.length) return noContent()
      return success(surveys)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
