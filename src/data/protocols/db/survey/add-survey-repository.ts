import { type AddSurveyParams } from '@/domain/use-cases'

export interface AddSurveyRepository {
  add: (data: AddSurveyParams) => Promise<void>
}
