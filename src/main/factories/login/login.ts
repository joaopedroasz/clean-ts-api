import { makeLoginValidation } from './login-validation'
import { LogControllerDecorator } from '../../decorators/log-controller'
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication'
import { LoginController } from '../../../presentation/controller/login/login'
import { type Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const SALT = 12
  const hashComparer = new BcryptAdapter(SALT)
  const encrypter = new JwtAdapter(env.JWT_SECRET)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
  const loginValidation = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, loginValidation)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
