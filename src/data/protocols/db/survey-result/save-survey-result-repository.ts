import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultModel } from '@/domain/use-cases'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
