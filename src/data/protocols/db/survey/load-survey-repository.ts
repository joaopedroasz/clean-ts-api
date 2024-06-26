import { type SurveyModel } from '@/domain/models'

export interface LoadSurveysRepository {
  load: (accountId: string) => Promise<SurveyModel[]>
}
