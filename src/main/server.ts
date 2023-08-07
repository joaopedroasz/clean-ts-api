import 'module-alias/register'

import { MongoHelper } from '@/infra/database/mongodb/helpers'
import env from './config/env'

MongoHelper.connect(env.MONGO_URL).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.SERVER_PORT, () => {
    console.log(`Server is running at http://localhost:${env.SERVER_PORT}`)
  })
}).catch(console.error)
