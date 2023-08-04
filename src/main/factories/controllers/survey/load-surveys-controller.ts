import { LoadSurveysController } from '../../../../presentation/controller/survey/load-surveys/load-surveys'
import { type Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller'
import { makeDbLoadSurveys } from '../../use-cases/survey/db-load-surveys'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
