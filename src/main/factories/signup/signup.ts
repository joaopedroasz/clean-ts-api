import { DbAddAccount } from '../../../data/use-cases/add-account/db-add-account'
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controller/signup/signup'
import { type Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const SALTS = 12
  const bcryptAdapter = new BcryptAdapter(SALTS)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

  const SALT = 12
  const hashComparer = new BcryptAdapter(SALT)
  const encrypter = new JwtAdapter(env.JWT_SECRET)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)

  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
