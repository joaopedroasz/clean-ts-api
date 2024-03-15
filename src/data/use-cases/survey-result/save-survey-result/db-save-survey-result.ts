import {
  type SaveSurveyResultParams,
  type SurveyResultModel,
  type SaveSurveyResult,
  type SaveSurveyResultRepository
} from './protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  public async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(data)
  }
}
