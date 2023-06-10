import { type Application, Router } from 'express'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'

export default (app: Application): void => {
  const router = Router()
  app.use('/api', router)
  const routesPath = resolve(__dirname, '..', 'routes')
  readdirSync(routesPath).map(async file => {
    const routePath = resolve(routesPath, file)
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(routePath)).default(router)
    }
  })
}
