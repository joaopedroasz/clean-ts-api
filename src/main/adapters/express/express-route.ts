import { type Response, type Request, type RequestHandler } from 'express'

import { type Controller, type HttpRequest } from '@/presentation/protocols'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
      res.end()
      return
    }
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body?.message
    })
    res.end()
  }
}
