import { type AddSurveyModel } from '../../../../domain/use-cases'

export interface AddSurveyRepository {
  add: (data: AddSurveyModel) => Promise<void>
}
