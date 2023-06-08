import { type Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

import app from '../config/app'
import { MongoHelper } from '../../infra/database/mongodb/helpers'
import { type AccountDocument } from '../../infra/database/mongodb/account/account-mongo-repository'

describe('Login Routes', () => {
  let accountCollection: Collection<AccountDocument>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('should 200 on signup', async () => {
      const response = await request(app).post('/api/signup').send({
        name: 'any_name',
        email: 'email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })

      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const email = 'valid_email@mail.com'
      const password = 'valid_password'
      const hashedPassword = await hash(password, 12)
      await accountCollection.insertOne({
        name: 'valid_name',
        email,
        password: hashedPassword
      })

      const response = await request(app).post('/api/login').send({ email, password })

      expect(response.statusCode).toBe(200)
    })

    it('should return 401 if login an uncreated account', async () => {
      const email = 'valid_email@mail.com'
      const password = 'valid_password'

      const response = await request(app).post('/api/login').send({ email, password })

      expect(response.statusCode).toBe(401)
    })
  })
})
