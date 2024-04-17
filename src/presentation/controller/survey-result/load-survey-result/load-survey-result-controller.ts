import { forbidden, serverError } from '@/presentation/helpers/http/http'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult } from './protocols'
import { InvalidParamError } from '../save-survey-result/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params?.surveyId as string
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      await this.loadSurveyResult.load(surveyId)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
