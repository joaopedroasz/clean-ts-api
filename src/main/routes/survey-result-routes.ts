import { type Router } from 'express'

import { userAuthMiddleware } from '@main/middlewares/user-auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { adaptExpressRoute } from '../adapters/express'

export default (router: Router): void => {
  const saveSurveyResultRoute = adaptExpressRoute(makeSaveSurveyResultController())
  router.put('/surveys/:surveyId/results', userAuthMiddleware, saveSurveyResultRoute)
}
