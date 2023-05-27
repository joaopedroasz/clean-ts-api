import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/database/mongodb/helpers'

describe('SignUp Routes', () => {
  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
