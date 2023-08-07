import { type Application } from 'express'
import { bodyParser, CORS, contentType } from '@main/middlewares'

export default (app: Application): void => {
  app.use(bodyParser)
  app.use(CORS)
  app.use(contentType)
}
