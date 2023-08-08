import MockDate from 'mockdate'

import { type SurveyModel, type LoadSurveyByIdRepository } from './protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  question: 'any_question',
  date: new Date()
})

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return a Survey on success', async () => {
    const { sut } = makeSut()

    const survey = await sut.loadById('any_id')

    expect(survey).toEqual(makeFakeSurvey())
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrowError(new Error())
  })
})
