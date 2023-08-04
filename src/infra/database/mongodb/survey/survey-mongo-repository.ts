import { type LoadSurveysRepository, type AddSurveyRepository } from '../../../../data/protocols'
import { type SurveyModel } from '../../../../domain/models'
import { type AddSurveyModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers'

export interface AnswerDocument {
  answer: string
  image?: string
}

export interface SurveyDocument {
  question: string
  answers: AnswerDocument[]
  date: Date
}

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  public async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>('surveys')
    await surveyCollection.insertOne(data)
  }

  public async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys.map(survey => MongoHelper.removeMongoId(survey))
  }
}
