import { DbAddAccount } from '@/data/use-cases/account/add-account/db-add-account'
import { type AddAccount } from '@/domain/use-cases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/database/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const SALTS = 12
  const bcryptAdapter = new BcryptAdapter(SALTS)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
