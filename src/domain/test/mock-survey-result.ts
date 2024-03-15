import { type SurveyResultModel } from '../models'
import { type SaveSurveyResultParams } from '../use-cases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_survey_id'
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
