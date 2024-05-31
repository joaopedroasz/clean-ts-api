import { type SurveyModel } from '../../models'

export type LoadSurveysParams = {
  accountId: string
}

export interface LoadSurveys {
  load: (params: LoadSurveysParams) => Promise<SurveyModel[]>
}
