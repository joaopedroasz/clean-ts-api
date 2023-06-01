import { type Response, type Request } from 'express'
import { type Controller, type HttpRequest } from '../../presentation/protocols'

export const adaptExpressRoute = async (controller: Controller, req: Request, res: Response): Promise<void> => {
  const httpRequest: HttpRequest = {
    body: req.body
  }
  const httpResponse = await controller.handle(httpRequest)
  if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
    res.status(httpResponse.statusCode).json(httpResponse.body)
    res.end()
    return
  }
  res.status(httpResponse.statusCode).json({
    error: httpResponse.body.message
  })
  res.end()
}
