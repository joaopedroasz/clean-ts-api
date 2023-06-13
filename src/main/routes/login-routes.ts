import { type Router } from 'express'
import { adaptExpressRoute } from '../adapters/express/express-route'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller'
import { makeLoginController } from '../factories/controllers/login/login-controller'

export default (router: Router): void => {
  router.post('/signup', async (req, res) => {
    await adaptExpressRoute(makeSignUpController(), req, res)
  })

  router.post('/login', async (req, res) => {
    await adaptExpressRoute(makeLoginController(), req, res)
  })
}
