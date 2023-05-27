import { type Application } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { CORS } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'

export default (app: Application): void => {
  app.use(bodyParser)
  app.use(CORS)
  app.use(contentType)
}
