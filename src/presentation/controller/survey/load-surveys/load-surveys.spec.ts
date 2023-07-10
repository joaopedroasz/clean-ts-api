import MockDate from 'mockdate'

import { LoadSurveysController } from './Load-surveys'
import { type SurveyModel, type LoadSurveys } from './protocols'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
})

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      public async load (): Promise<SurveyModel[]> {
        return [makeFakeSurvey()]
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })
})
