import { type LoadSurveyResult } from '@/domain/use-cases'
import { DbLoadSurveyResult } from '@/data/use-cases/survey-result/load-survey-result/db-load-survey-result'
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@/infra/database/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
