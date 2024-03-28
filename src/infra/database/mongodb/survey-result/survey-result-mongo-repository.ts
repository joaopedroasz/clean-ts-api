import { ObjectId } from 'mongodb'

import type { SurveyResultModel, SurveyResultAnswerModel } from '@/domain/models'
import { type SaveSurveyResultParams } from '@/domain/use-cases'
import { type SaveSurveyResultRepository } from '@/data/protocols'
import { MongoHelper } from '../helpers'

export type SurveyResultDocument = {
  date: string
  surveyId: ObjectId
  accountId: ObjectId
  answer: string
}

export type SurveyResultAggregation = {
  surveyId: ObjectId
  question: string
  date: string
  answers: SurveyResultAnswerModel[]
}

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private readonly collectionName = 'survey_results'

  private mapToDocument (surveyResult: SaveSurveyResultParams): SurveyResultDocument {
    return {
      ...surveyResult,
      accountId: new ObjectId(surveyResult.accountId),
      surveyId: new ObjectId(surveyResult.surveyId),
      date: surveyResult.date.toISOString()
    }
  }

  public async save ({ answer, date, accountId, surveyId }: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection<SurveyResultDocument>(this.collectionName)
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: this.mapToDocument({ answer, date, accountId, surveyId })
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    const surveyResult = await this.loadBySurveyId(surveyId)
    if (!surveyResult) throw new Error('Error on save survey result')
    return {
      ...surveyResult,
      surveyId: surveyResult.surveyId.toHexString(),
      date: new Date(surveyResult.date)
    }
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultAggregation | undefined> {
    const surveyResultCollection = await MongoHelper.getCollection(this.collectionName)
    const query = surveyResultCollection.aggregate<SurveyResultAggregation>([{
      $match: {
        surveyId: new ObjectId(surveyId)
      }
    }, {
      $group: {
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $unwind: {
        path: '$data'
      }
    }, {
      $lookup: {
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      }
    }, {
      $unwind: {
        path: '$survey'
      }
    }, {
      $group: {
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer']
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $unwind: {
        path: '$_id.answer'
      }
    }, {
      $addFields: {
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{
            $divide: ['$count', '$_id.total']
          }, 100]
        }
      }
    }, {
      $group: {
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      }
    }, {
      $project: {
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      }
    }])
    const surveyResult = await query.toArray()
    return surveyResult?.length ? surveyResult[0] : undefined
  }
}
