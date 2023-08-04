import { type Router } from 'express'
import { adaptExpressRoute } from '../adapters/express/express-route'
import { makeAddSurveyController } from '../factories/controllers/survey/survey-controller'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware'
import { adaptExpressMiddleware } from '../adapters/express/express-middleware'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys-controller'

export default (router: Router): void => {
  const adminAuthMiddleware = adaptExpressMiddleware(makeAuthMiddleware('admin'))
  const authMiddleware = adaptExpressMiddleware(makeAuthMiddleware())
  const addSurveyRoute = adaptExpressRoute(makeAddSurveyController())
  const loadSurveyRoute = adaptExpressRoute(makeLoadSurveysController())
  router.post('/surveys', adminAuthMiddleware, addSurveyRoute)
  router.get('/surveys', authMiddleware, loadSurveyRoute)
}
