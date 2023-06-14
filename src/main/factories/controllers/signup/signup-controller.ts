import { SignUpController } from '../../../../presentation/controller/sign/signup/signup'
import { type Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller'
import { makeDbAddAccount } from '../../use-cases/db-add-account'
import { makeDbAuthentication } from '../../use-cases/db-authentication'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
