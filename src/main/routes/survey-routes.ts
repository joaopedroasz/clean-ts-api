import { type Router } from 'express'

import { adaptExpressRoute } from '@main/adapters/express/express-route'
import { makeAddSurveyController } from '@factories/controllers/survey/survey-controller'
import { makeLoadSurveysController } from '@factories/controllers/survey/load-surveys-controller'
import { adminAuthMiddleware } from '@main/middlewares/admin-auth'
import { userAuthMiddleware } from '@main/middlewares/user-auth'

export default (router: Router): void => {
  const addSurveyRoute = adaptExpressRoute(makeAddSurveyController())
  const loadSurveyRoute = adaptExpressRoute(makeLoadSurveysController())
  router.post('/surveys', adminAuthMiddleware, addSurveyRoute)
  router.get('/surveys', userAuthMiddleware, loadSurveyRoute)
}
