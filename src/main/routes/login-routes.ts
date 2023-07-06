import { type Router } from 'express'
import { adaptExpressRoute } from '../adapters/express/express-route'
import { makeSignUpController } from '../factories/controllers/account/signup/signup-controller'
import { makeLoginController } from '../factories/controllers/account/login/login-controller'

export default (router: Router): void => {
  const signUpRoute = adaptExpressRoute(makeSignUpController())
  router.post('/signup', signUpRoute)

  const loginRoute = adaptExpressRoute(makeLoginController())
  router.post('/login', loginRoute)
}
