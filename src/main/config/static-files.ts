import express, { type Application } from 'express'
import { resolve } from 'path'

export default (app: Application): void => {
  app.use('/static', express.static(resolve(__dirname, '..', '..', 'static')))
}
