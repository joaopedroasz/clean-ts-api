import { type Collection } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { type AccountModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb/helpers'
import { type AccountDocument } from '@/infra/database/mongodb/account/account-mongo-repository'
import { type SurveyDocument } from '@/infra/database/mongodb/survey/survey-mongo-repository'
import app from '@main/config/app'
import env from '@main/config/env'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  role: 'admin'
})

describe('Survey Routes', () => {
  let surveyCollection: Collection<SurveyDocument>
  let accountCollection: Collection<AccountDocument>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

  const makeAccessToken = async (): Promise<string> => {
    const { insertedId } = await accountCollection.insertOne(makeFakeAccountModel())

    const accessToken = sign({ id: insertedId.toHexString() }, env.JWT_SECRET)

    await accountCollection.updateOne({
      _id: insertedId
    }, {
      $set: {
        accessToken
      }
    })

    return accessToken
  }

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection<SurveyDocument>('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection<AccountDocument>('accounts')
    await accountCollection.deleteMany({})
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
      const accessToken = await makeAccessToken()

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

  describe('GET /surveys', () => {
    it('should return 403 on load surveys anonymously', async () => {
      const response = await request(app).get('/api/surveys')

      expect(response.statusCode).toBe(403)
    })

    it('should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      const response = await request(app).get('/api/surveys').set('x-access-token', accessToken)

      expect(response.statusCode).toBe(204)
    })

    it('should return 200 on load surveys with valid accessToken and surveys', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: '2023-02-01'
      }, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }, {
          answer: 'other_answer'
        }],
        date: '2023-02-01'
      }])

      const accessToken = await makeAccessToken()

      const response = await request(app).get('/api/surveys').set('x-access-token', accessToken)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([{
        id: expect.any(String),
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        didAnswer: false,
        date: '2023-02-01T00:00:00.000Z'
      }, {
        id: expect.any(String),
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }, {
          answer: 'other_answer'
        }],
        didAnswer: false,
        date: '2023-02-01T00:00:00.000Z'
      }])
    })
  })
})
