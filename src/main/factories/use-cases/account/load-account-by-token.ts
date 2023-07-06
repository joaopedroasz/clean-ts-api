import { DbLoadAccountByToken } from '../../../../data/use-cases/load-account-by-token/db-load-account-by-token'
import { type LoadAccountByToken } from '../../../../domain/use-cases'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
