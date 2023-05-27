import { json, type Application } from 'express'

export const bodyParser = (app: Application): void => {
  app.use(json())
}
