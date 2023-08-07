import { type Request, type Response, type NextFunction } from 'express'

import { type HttpRequest, type Middleware } from '@/presentation/protocols'

export const adaptExpressMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
      return
    }
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
    res.end()
  }
}
