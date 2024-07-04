import {
  type LoadSurveys,
  type Controller,
  type HttpResponse,
  success,
  serverError,
  noContent
} from './protocols'

export class LoadSurveysController implements Controller<LoadSurveysController.Request> {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle ({ accountId }: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load({ accountId })
      if (!surveys.length) return noContent()
      return success(surveys)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
