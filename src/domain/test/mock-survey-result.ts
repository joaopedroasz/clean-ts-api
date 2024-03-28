import { type SurveyResultModel } from '../models'
import { type SaveSurveyResultParams } from '../use-cases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 1,
    percent: 10
  }, {
    answer: 'other_answer',
    count: 2,
    percent: 20
  }],
  date: new Date()
})

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
