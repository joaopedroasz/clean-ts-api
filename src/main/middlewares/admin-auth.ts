import { adaptExpressMiddleware } from '@main/adapters/express'
import { makeAuthMiddleware } from '@factories/middlewares/auth-middleware'

export const adminAuthMiddleware = adaptExpressMiddleware(makeAuthMiddleware('admin'))
