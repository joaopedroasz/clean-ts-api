import { makeLoginValidation } from './login-validation'
import { LoginController } from '../../../../../presentation/controller/sign/login/login'
import { type Controller } from '../../../../../presentation/protocols'
import { makeDbAuthentication } from '../../../use-cases/account/db-authentication'
import { makeLogControllerDecorator } from '../../../decorators/log-controller'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
