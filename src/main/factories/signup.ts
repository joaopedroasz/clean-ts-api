import { DbAddAccount } from '../../data/use-cases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography'
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const SALTS = 12
  const bcryptAdapter = new BcryptAdapter(SALTS)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const emailValidator = new EmailValidatorAdapter()
  return new SignUpController(emailValidator, dbAddAccount)
}
