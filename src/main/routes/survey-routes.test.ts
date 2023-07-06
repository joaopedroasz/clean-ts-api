import { type Collection } from 'mongodb'
import request from 'supertest'

import app from '../config/app'
import { MongoHelper } from '../../infra/database/mongodb/helpers'
import { type AccountDocument } from '../../infra/database/mongodb/account/account-mongo-repository'

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
  })
})
