import { type Router } from 'express'

import { userAuthMiddleware } from '@main/middlewares/user-auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { makeLoadSurveyResultController } from '../factories/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { adaptExpressRoute } from '../adapters/express'

export default (router: Router): void => {
  const saveSurveyResultRoute = adaptExpressRoute(makeSaveSurveyResultController())
  const loadSurveyResultRoute = adaptExpressRoute(makeLoadSurveyResultController())
  router.put('/surveys/:surveyId/results', userAuthMiddleware, saveSurveyResultRoute)
  router.get('/surveys/:surveyId/results', userAuthMiddleware, loadSurveyResultRoute)
}
