import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('should an account on success', async () => {
    const response = await request(app).post('/api/signup').send({
      name: 'any_name',
      email: 'email@mail.com',
      password: '123',
      passwordConfirmation: '123'
    })

    expect(response.statusCode).toBe(200)
  })
})
