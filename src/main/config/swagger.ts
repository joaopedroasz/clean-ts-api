import swaggerUi from 'swagger-ui-express'
import { type Application } from 'express'

import swaggerConfig from '../docs'

export default (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}
