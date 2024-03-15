import { ObjectId } from 'mongodb'

import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultModel } from '@/domain/use-cases'
import { type SaveSurveyResultRepository } from '@/data/protocols'
import { type DataWithMongoId, MongoHelper } from '../helpers'

export type SurveyResultDocument = {
  date: string
  surveyId: ObjectId
  accountId: ObjectId
  answer: string
}

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private readonly collectionName = 'survey_results'

  private mapToModel (surveyResult: DataWithMongoId<SurveyResultDocument>): SurveyResultModel {
    return MongoHelper.removeMongoId({
      ...surveyResult,
      accountId: surveyResult.accountId.toString(),
      surveyId: surveyResult.surveyId.toString(),
      date: new Date(surveyResult.date)
    })
  }

  private mapToDocument (surveyResult: SaveSurveyResultModel): SurveyResultDocument {
    return {
      ...surveyResult,
      accountId: new ObjectId(surveyResult.accountId),
      surveyId: new ObjectId(surveyResult.surveyId),
      date: surveyResult.date.toISOString()
    }
  }

  public async save ({ answer, date, accountId, surveyId }: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection<SurveyResultDocument>(this.collectionName)
    const surveyResult = await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: this.mapToDocument({ answer, date, accountId, surveyId })
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    if (!surveyResult) throw new Error('Error on save survey result')
    return this.mapToModel(surveyResult)
  }
}
