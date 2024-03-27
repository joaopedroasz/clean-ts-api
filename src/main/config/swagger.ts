import swaggerUi from 'swagger-ui-express'
import { type Application } from 'express'

import swaggerConfig from '../docs'
import { noCache } from '../middlewares'

export default (app: Application): void => {
  app.use('/api-docs', noCache, swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}
