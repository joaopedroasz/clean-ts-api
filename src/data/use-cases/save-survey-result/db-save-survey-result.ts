import {
  type SaveSurveyResultModel,
  type SurveyResultModel,
  type SaveSurveyResult,
  type SaveSurveyResultRepository
} from './protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  public async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
  }
}
