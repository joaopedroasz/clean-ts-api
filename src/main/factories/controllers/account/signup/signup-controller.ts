import { SignUpController } from '@/presentation/controller/sign/signup/signup'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@factories/decorators/log-controller'
import { makeDbAddAccount } from '@factories/use-cases/account/db-add-account'
import { makeDbAuthentication } from '@factories/use-cases/account/db-authentication'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
