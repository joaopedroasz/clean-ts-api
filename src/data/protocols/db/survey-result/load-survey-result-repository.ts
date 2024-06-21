import { type SurveyResultModel } from '@/domain/models'
import { type LoadSurveyResultParams } from '@/domain/use-cases'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (params: LoadSurveyResultParams) => Promise<SurveyResultModel | undefined>
}
