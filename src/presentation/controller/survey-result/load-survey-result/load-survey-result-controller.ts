import { forbidden, serverError } from '@/presentation/helpers/http/http'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './protocols'
import { InvalidParamError } from '../save-survey-result/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params?.surveyId as string)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
