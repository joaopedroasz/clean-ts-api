import { type AddSurveyRepository } from '../../../../data/protocols'
import { type AddSurveyModel } from '../../../../domain/use-cases'
import { MongoHelper } from '../helpers'

export interface AnswerDocument {
  answer: string
  image?: string
}

export interface SurveyDocument {
  question: string
  answers: AnswerDocument[]
}

export class SurveyMongoRepository implements AddSurveyRepository {
  public async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>('surveys')
    await surveyCollection.insertOne(data)
  }
}
