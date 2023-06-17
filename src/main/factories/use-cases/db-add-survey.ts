import { DbAddSurvey } from '../../../data/use-cases/add-survey/db-add-survey'
import { type AddSurvey } from '../../../domain/use-cases'
import { SurveyMongoRepository } from '../../../infra/database/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
