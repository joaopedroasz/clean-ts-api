import { type Application, Router } from 'express'
import fg from 'fast-glob'
import { resolve } from 'node:path'

export default (app: Application): void => {
  const router = Router()
  app.use('/api', router)
  const routesPath = resolve(__dirname, '..', 'routes', '**', '*routes.ts')
  fg.sync(routesPath).map(async file => (await import(file)).default(router))
}
