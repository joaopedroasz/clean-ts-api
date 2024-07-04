import { forbidden, serverError, success } from '@/presentation/helpers/http/http'
import type { Controller, HttpResponse, LoadSurveyById, LoadSurveyResult } from './protocols'
import { InvalidParamError } from '../save-survey-result/protocols'

export class LoadSurveyResultController implements Controller<LoadSurveyResultController.Request> {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  public async handle ({ accountId, surveyId }: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      const surveyResult = await this.loadSurveyResult.load({ surveyId, accountId })
      return success(surveyResult)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
