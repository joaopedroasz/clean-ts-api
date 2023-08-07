import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { type Middleware } from '@/presentation/protocols'
import { makeLoadAccountByToken } from '@factories/use-cases/account/load-account-by-token'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const loadAccountByToken = makeLoadAccountByToken()
  return new AuthMiddleware(loadAccountByToken, role)
}
