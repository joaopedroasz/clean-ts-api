import { type SurveyModel } from '@/domain/models'
import { type AddSurveyModel } from '@/domain/use-cases'
import { type LoadSurveysRepository, type AddSurveyRepository, type LoadSurveyByIdRepository } from '@/data/protocols'
import { type DataWithMongoId, MongoHelper } from '../helpers'
import { ObjectId } from 'mongodb'

export type AnswerDocument = {
  answer: string
  image?: string
}

export type SurveyDocument = {
  question: string
  answers: AnswerDocument[]
  date: string
}

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  private readonly collectionName = 'surveys'

  private mapToModel (data: DataWithMongoId<SurveyDocument>): SurveyModel {
    const dataWithoutId = MongoHelper.removeMongoId(data)
    return {
      ...dataWithoutId,
      date: new Date(data.date)
    }
  }

  public async add ({ date, ...data }: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    await surveyCollection.insertOne({
      ...data,
      date: date.toISOString()
    })
  }

  public async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    const surveys = await surveyCollection.find().toArray()
    return surveys.map(this.mapToModel)
  }

  public async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return this.mapToModel(survey)
  }
}
