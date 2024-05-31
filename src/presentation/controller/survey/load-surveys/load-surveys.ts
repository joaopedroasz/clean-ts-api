import {
  type LoadSurveys,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  success,
  serverError,
  noContent,
  badRequest
} from './protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.accountId) return badRequest(new Error('Missing param: accountId'))
      const surveys = await this.loadSurveys.load({ accountId: httpRequest.accountId })
      if (!surveys.length) return noContent()
      return success(surveys)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
