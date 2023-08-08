import { type SurveyModel } from '../models'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyModel | undefined>
}
