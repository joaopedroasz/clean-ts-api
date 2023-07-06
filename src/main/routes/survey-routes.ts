import { type Router } from 'express'
import { adaptExpressRoute } from '../adapters/express/express-route'
import { makeAddSurveyController } from '../factories/controllers/survey/survey-controller'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware'
import { adaptExpressMiddleware } from '../adapters/express/express-middleware'

export default (router: Router): void => {
  const adminAuthMiddleware = adaptExpressMiddleware(makeAuthMiddleware('admin'))
  const addSurveyRoute = adaptExpressRoute(makeAddSurveyController())
  router.post('/surveys', adminAuthMiddleware, addSurveyRoute)
}
