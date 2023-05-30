import { type Router } from 'express'
import { makeSignUpController } from '../factories/signup'
import { adaptExpressRoute } from '../adapters/express-route'

export default (router: Router): void => {
  router.post('/signup', async (req, res) => {
    await adaptExpressRoute(makeSignUpController(), req, res)
  })
}