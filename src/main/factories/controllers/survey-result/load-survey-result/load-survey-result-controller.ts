import { type Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/survey/db-load-survey-by-id'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller'
import { LoadSurveyResultController } from '@/presentation/controller/survey-result/load-survey-result/load-survey-result'
import { makeDbLoadSurveyResult } from '@/main/factories/use-cases/survey-result/db-load-survey-result'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
