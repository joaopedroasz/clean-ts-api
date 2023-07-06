import { type Collection } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import app from '../config/app'
import { MongoHelper } from '../../infra/database/mongodb/helpers'
import { type AccountDocument } from '../../infra/database/mongodb/account/account-mongo-repository'
import { type AccountModel } from '../../domain/models'
import env from '../config/env'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'admin'
})

describe('Survey Routes', () => {
  let surveyCollection: Collection<AccountDocument>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection<AccountDocument>('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return 403 on add survey anonymously', async () => {
      const response = await request(app).post('/api/surveys').send({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }]
      })

      expect(response.statusCode).toBe(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
      const { insertedId } = await accountCollection.insertOne(makeFakeAccountModel())

      const accessToken = sign({ id: insertedId.toHexString() }, env.JWT_SECRET)

      await accountCollection.updateOne({
        _id: insertedId
      }, {
        $set: {
          accessToken
        }
      })

      const response = await request(app).post('/api/surveys').set('x-access-token', accessToken).send({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }]
      })

      expect(response.statusCode).toBe(204)
    })
  })
})
