import { type Router } from 'express'
import { adaptExpressRoute } from '../adapters/express/express-route'
import { makeAddSurveyController } from '../factories/controllers/survey/survey-controller'

export default (router: Router): void => {
  router.post('/surveys', async (req, res) => {
    await adaptExpressRoute(makeAddSurveyController(), req, res)
  })
}
