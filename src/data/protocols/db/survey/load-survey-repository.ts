import { type SurveyModel } from '../../../../domain/models'

export interface LoadSurveysRepository {
  load: () => Promise<SurveyModel[]>
}
