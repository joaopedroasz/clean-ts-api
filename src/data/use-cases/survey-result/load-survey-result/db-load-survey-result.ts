import { type LoadSurveyResult } from '@/domain/use-cases'
import type { LoadSurveyResultRepository, SurveyResultModel } from './protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyRepository: LoadSurveyResultRepository
  ) {}

  public async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyRepository.loadBySurveyId(surveyId)
  }
}
