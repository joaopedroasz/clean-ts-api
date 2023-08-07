import { AddSurveyController } from '@/presentation/controller/survey/add-survey/add-survey'
import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller'
import { makeDbAddSurvey } from '../../use-cases/survey/db-add-survey'
import { makeSurveyValidation } from './survey-validation'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
