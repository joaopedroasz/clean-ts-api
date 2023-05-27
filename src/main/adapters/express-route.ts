import { type Response, type Request } from 'express'
import { type Controller, type HttpRequest } from '../../presentation/protocols'

export const adaptExpressRoute = async (controller: Controller, req: Request, res: Response): Promise<void> => {
  const httpRequest: HttpRequest = {
    body: req.body
  }
  const httpResponse = await controller.handle(httpRequest)
  res.status(httpResponse.statusCode).json(httpResponse.body)
}
