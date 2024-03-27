import { loginPath, signupPath, surveyPath, surveyResultPath } from './paths'
import {
  accountSchema,
  addSurveySchema,
  apiKeyAuthSchema,
  errorSchema,
  loginSchema,
  saveSurveyResultSchema,
  signupSchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema
} from './schemas'
import {
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '2.2.2'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Survey'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    login: loginSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    signup: signupSchema,
    addSurvey: addSurveySchema,
    saveSurveyResult: saveSurveyResultSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    unauthorized: unauthorizedComponent,
    notFound: notFoundComponent,
    forbidden: forbiddenComponent
  }
}
