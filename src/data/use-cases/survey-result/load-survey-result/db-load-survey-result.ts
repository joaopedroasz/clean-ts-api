import { type LoadSurveyResult } from '@/domain/use-cases'
import type { LoadSurveyByIdRepository, LoadSurveyResultRepository, SurveyResultModel } from './protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async load (surveyId: string): Promise<SurveyResultModel> {
    const result = await this.loadSurveyRepository.loadBySurveyId(surveyId)
    if (!result) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }
    return result
  }
}
