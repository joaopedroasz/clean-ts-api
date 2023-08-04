import { adaptExpressMiddleware } from '../adapters/express/express-middleware'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware'

export const userAuthMiddleware = adaptExpressMiddleware(makeAuthMiddleware())
