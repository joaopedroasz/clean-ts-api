import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller'
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/db-save-survey-result'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/survey/db-load-survey-by-id'
import { SaveSurveyResultController } from '@/presentation/controller/survey-result/save-survey-result/save-survey-result'
import { type Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
