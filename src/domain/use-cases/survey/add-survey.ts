import { type SurveyModel } from '../../models'

export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>
}
