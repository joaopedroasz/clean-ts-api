import { ObjectId } from 'mongodb'

import type { SurveyResultModel, SurveyResultAnswerModel } from '@/domain/models'
import { type LoadSurveyResultParams, type SaveSurveyResultParams } from '@/domain/use-cases'
import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { MongoHelper, QueryBuilder } from '../helpers'

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

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  private readonly collectionName = 'survey_results'

  private mapToDocument (surveyResult: SaveSurveyResultParams): SurveyResultDocument {
    return {
      ...surveyResult,
      accountId: new ObjectId(surveyResult.accountId),
      surveyId: new ObjectId(surveyResult.surveyId),
      date: surveyResult.date.toISOString()
    }
  }

  private mapToModel (surveyResult: SurveyResultAggregation): SurveyResultModel {
    return {
      ...surveyResult,
      surveyId: surveyResult.surveyId.toHexString(),
      date: new Date(surveyResult.date)
    }
  }

  public async save ({ answer, date, accountId, surveyId }: SaveSurveyResultParams): Promise<void> {
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
  }

  public async loadBySurveyId ({ surveyId, accountId }: LoadSurveyResultParams): Promise<SurveyResultModel | undefined> {
    const surveyResultCollection = await MongoHelper.getCollection(this.collectionName)
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              {
                $eq: ['$data.accountId', new ObjectId(accountId)]
              },
              '$data.answer',
              undefined
            ]
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAccountAnswer: {
                  $eq: ['$$item.answer', {
                    $arrayElemAt: ['$currentAccountAnswer', 0]
                  }]
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: {
            $round: ['$count']
          },
          percent: {
            $round: ['$percent']
          },
          isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer'
        }
      })
      .sort({
        'answer.count': -1,
        'answer.answer': 1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const aggregation = surveyResultCollection.aggregate<SurveyResultAggregation>(query)
    const surveyResult = await aggregation.toArray()
    return surveyResult?.length ? this.mapToModel(surveyResult[0]) : undefined
  }
}
