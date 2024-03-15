import { type SurveyModel } from '../models'
import { type AddSurveyParams } from '../use-cases'

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  question: 'any_question',
  date: new Date()
})

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date()
})
