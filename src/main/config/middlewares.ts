import { type Application } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { CORS } from '../middlewares/cors'

export default (app: Application): void => {
  app.use(bodyParser)
  app.use(CORS)
}
