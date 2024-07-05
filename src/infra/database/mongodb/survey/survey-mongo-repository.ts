import { ObjectId } from 'mongodb'

import { type SurveyModel } from '@/domain/models'
import { type LoadSurveysRepository, type AddSurveyRepository, type LoadSurveyByIdRepository } from '@/data/protocols'
import { type DataWithMongoId, MongoHelper, QueryBuilder } from '../helpers'

export type AnswerDocument = {
  answer: string
  image?: string
}

export type SurveyDocument = {
  question: string
  answers: AnswerDocument[]
  date: string
  didAnswer?: boolean
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

  public async add ({ date, ...data }: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    await surveyCollection.insertOne({
      ...data,
      date: date.toISOString()
    })
  }

  public async load (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    const query = new QueryBuilder()
      .lookup({
        from: 'survey_results',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate<DataWithMongoId<SurveyDocument>>(query).toArray()
    return surveys.map(survey => this.mapToModel(survey))
  }

  public async loadById (id: string): Promise<SurveyModel | undefined> {
    const surveyCollection = await MongoHelper.getCollection<SurveyDocument>(this.collectionName)
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    if (!survey) return undefined
    return this.mapToModel(survey)
  }
}
