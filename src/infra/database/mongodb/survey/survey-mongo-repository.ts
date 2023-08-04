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
  private readonly collectionName = 'surveys'

  public async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    await surveyCollection.insertOne(data)
  }

  public async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.removeManyMongoIds(surveys)
  }
}
