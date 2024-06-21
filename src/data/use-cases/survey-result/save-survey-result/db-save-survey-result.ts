import type {
  SaveSurveyResultParams,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from './protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  public async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const result = await this.loadSurveyResultRepository.loadBySurveyId({ accountId: data.accountId, surveyId: data.surveyId })
    if (!result) throw new Error('Survey Result not found')
    return result
  }
}
