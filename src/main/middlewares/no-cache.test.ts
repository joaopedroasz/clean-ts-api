import request from 'supertest'
import app from '@main/config/app'
import { noCache } from '@main/middlewares/no-cache'

describe('NoCache Middleware', () => {
  it('should disable cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => {
      res.send()
    })

    const response = await request(app).get('/test_no_cache')

    expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate')
    expect(response.headers.pragma).toBe('no-cache')
    expect(response.headers.expires).toBe('0')
    expect(response.headers['surrogate-control']).toBe('no-store')
  })
})
