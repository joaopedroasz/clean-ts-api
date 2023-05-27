import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  it('should parse request body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    const response = await request(app).post('/test_body_parser').send({ name: 'any_name' })

    expect(response.body).toEqual({ name: 'any_name' })
  })
})
