import { type Application } from 'express'
import { bodyParser } from '../middlewares/body-parser'

export default (app: Application): void => {
  bodyParser(app)
}
