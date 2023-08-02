import { type LoadSurveysRepository, type SurveyModel } from './protocols'
import { DbLoadSurveys } from './db-load-surveys'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date()
})

describe('DbLoadSurveys', () => {
  it('should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async load (): Promise<SurveyModel[]> {
        return [makeFakeSurvey()]
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')

    await sut.load()

    expect(loadSpy).toHaveBeenCalled()
  })
})
