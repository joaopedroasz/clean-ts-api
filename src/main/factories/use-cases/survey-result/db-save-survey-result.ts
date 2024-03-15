import { DbSaveSurveyResult } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result'
import { type SaveSurveyResult } from '@/domain/use-cases'
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
