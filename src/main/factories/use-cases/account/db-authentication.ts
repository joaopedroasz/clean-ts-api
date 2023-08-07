import { DbAuthentication } from '@/data/use-cases/authentication/db-authentication'
import { type Authentication } from '@/domain/use-cases'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/database/mongodb/account/account-mongo-repository'
import env from '@main/config/env'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const SALT = 12
  const hashComparer = new BcryptAdapter(SALT)
  const encrypter = new JwtAdapter(env.JWT_SECRET)
  return new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
}
