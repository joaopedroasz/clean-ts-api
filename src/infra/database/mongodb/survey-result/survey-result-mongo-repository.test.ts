import { type Collection } from 'mongodb'

import { MongoHelper } from '../helpers'
import { type SurveyDocument } from '../survey/survey-mongo-repository'
import { type AccountDocument } from '../account/account-mongo-repository'
import { type SurveyResultDocument, SurveyResultMongoRepository } from './survey-result-mongo-repository'

const makeFakeSurveyDocument = (): SurveyDocument => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: '2023-02-01T00:00:00.000Z'
})

const makeFakeAccountDocument = (): AccountDocument => ({
  email: 'emaiL@mail.com',
  name: 'name',
  password: 'password'
})

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  let surveyCollection: Collection<SurveyDocument>
  let accountCollection: Collection<AccountDocument>
  let surveyResultCollection: Collection<SurveyResultDocument>

  const MONGO_URL = process.env.MONGO_URL ?? 'any_url'

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

    surveyResultCollection = await MongoHelper.getCollection<SurveyResultDocument>('survey_results')
    await surveyResultCollection.deleteMany({})
  })

  describe('save', () => {
    it('should add a survey result if its new', async () => {
      const sut = makeSut()

      const { insertedId: surveyObjectId } = await surveyCollection.insertOne(makeFakeSurveyDocument())
      const surveyId = surveyObjectId.toHexString()

      const { insertedId: accountObjectId } = await accountCollection.insertOne(makeFakeAccountDocument())
      const accountId = accountObjectId.toHexString()

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date('2023-02-01T00:00:00.000Z')
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('any_answer')
    })

    it('should update a survey result if its not new', async () => {
      const sut = makeSut()

      const { insertedId: surveyObjectId } = await surveyCollection.insertOne(makeFakeSurveyDocument())
      const surveyId = surveyObjectId.toHexString()

      const { insertedId: accountObjectId } = await accountCollection.insertOne(makeFakeAccountDocument())
      const accountId = accountObjectId.toHexString()

      const { insertedId: surveyResultObjectId } = await surveyResultCollection.insertOne({
        surveyId: surveyObjectId,
        accountId: accountObjectId,
        answer: 'any_answer',
        date: '2023-02-01T00:00:00.000Z'
      })

      const surveyResultId = surveyResultObjectId.toHexString()

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'other_answer',
        date: new Date('2023-02-01T00:00:00.000Z')
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBe(surveyResultId)
      expect(surveyResult.answer).toBe('other_answer')
    })
  })
})
