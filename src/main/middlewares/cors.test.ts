import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  it('should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })

    const response = await request(app).get('/test_cors')

    expect(response.headers['access-control-allow-origin']).toEqual('*')
    expect(response.headers['access-control-allow-methods']).toEqual('*')
    expect(response.headers['access-control-allow-headers']).toEqual('*')
  })
})
