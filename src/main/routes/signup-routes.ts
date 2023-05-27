import { type Router } from 'express'

export default (app: Router): void => {
  app.post('/signup', (req, res) => {
    res.json({
      ok: true
    })
  })
}
