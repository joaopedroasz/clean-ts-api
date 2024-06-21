import { type SurveyResultModel } from '../../models'

export type LoadSurveyResultParams = {
  surveyId: string
  accountId: string
}

export interface LoadSurveyResult {
  load: (params: LoadSurveyResultParams) => Promise<SurveyResultModel>
}
