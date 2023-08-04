import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers'
import { SurveyMongoRepository, type SurveyDocument } from './survey-mongo-repository'
import { type AddSurveyModel } from '../../../../domain/use-cases'

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date()
})

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

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('survey-mongo-repository.test', () => {
  let surveyCollection: Collection<SurveyDocument>

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
  })

  describe('add', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add(makeFakeSurvey())

      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
      expect(survey?.answers).toEqual([{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer',
        image: 'other_image'
      }])
    })
  })

  describe('load', () => {
    test('should load all surveys on success', async () => {
      await surveyCollection.insertMany([makeFakeSurveyDocument(), makeFakeSurveyDocument()])

      const sut = makeSut()

      const surveys = await sut.load()

      expect(surveys).toBeTruthy()
      expect(surveys).toHaveLength(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('any_question')
    })

    test('should load empty list', async () => {
      const sut = makeSut()

      const surveys = await sut.load()

      expect(surveys).toBeTruthy()
      expect(surveys).toHaveLength(0)
    })
  })
})
