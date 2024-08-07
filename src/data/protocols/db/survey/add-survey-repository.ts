import type { AddSurvey } from '@/domain/use-cases'

export interface AddSurveyRepository {
  add: (data: AddSurveyRepository.Params) => Promise<void>
}

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
}
