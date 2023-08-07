import { DbLoadSurveys } from '@/data/use-cases/db-load-surveys/db-load-surveys'
import { type LoadSurveys } from '@/domain/use-cases'
import { SurveyMongoRepository } from '@/infra/database/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
