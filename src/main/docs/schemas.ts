import {
  accountSchema,
  addSurveySchema,
  errorSchema,
  loginSchema,
  saveSurveyResultSchema,
  signupSchema,
  surveyAnswerSchema,
  surveyResultAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema
} from './schemas/'

export const schemas = {
  account: accountSchema,
  login: loginSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  signup: signupSchema,
  addSurvey: addSurveySchema,
  saveSurveyResult: saveSurveyResultSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}
