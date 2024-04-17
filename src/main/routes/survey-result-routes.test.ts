import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { type Collection } from 'mongodb'

import app from '@main/config/app'
import { type AccountModel } from '@/domain/models'
import { type SurveyDocument } from '@/infra/database/mongodb/survey/survey-mongo-repository'
import { type AccountDocument } from '@/infra/database/mongodb/account/account-mongo-repository'
import env from '../config/env'
import { MongoHelper } from '@/infra/database/mongodb/helpers'
import { type SurveyResultDocument } from '@/infra/database/mongodb/survey-result/survey-result-mongo-repository'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('Survey Result Routes', () => {
  let surveyCollection: Collection<SurveyDocument>
  let accountCollection: Collection<AccountDocument>
  let surveyResultCollection: Collection<SurveyResultDocument>

  const MONGO_URL = env.MONGO_URL ?? 'any_url'

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

    surveyResultCollection = await MongoHelper.getCollection<SurveyResultDocument>('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      const response = await request(app).put('/api/surveys/any_survey_id/results').send({
        answer: 'any_answer'
      })

      expect(response.statusCode).toBe(403)
    })

    it('should return 200 on save survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      const { insertedId } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date().toISOString()
      })
      const createdSurveyId = insertedId.toString()

      const response = await request(app).put(`/api/surveys/${createdSurveyId}/results`).set('x-access-token', accessToken).send({
        answer: 'any_answer'
      })

      expect(response.statusCode).toBe(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without accessToken', async () => {
      const response = await request(app).get('/api/surveys/any_survey_id/results')

      expect(response.statusCode).toBe(403)
    })
  })
})
