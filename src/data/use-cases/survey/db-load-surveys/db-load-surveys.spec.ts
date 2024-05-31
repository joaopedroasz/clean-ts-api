import MockDate from 'mockdate'

import { type LoadSurveysRepository } from './protocols'
import { DbLoadSurveys } from './db-load-surveys'
import { mockLoadSurveysRepository } from '@/data/test'
import { mockLoadSurveysParams, mockSurveyModel } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')

    const params = mockLoadSurveysParams()
    await sut.load(params)

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return a list of Surveys on success', async () => {
    const { sut } = makeSut()

    const params = mockLoadSurveysParams()
    const surveys = await sut.load(params)

    expect(surveys).toEqual([mockSurveyModel()])
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()

    jest.spyOn(loadSurveysRepositoryStub, 'load').mockRejectedValueOnce(new Error())

    const promise = sut.load(mockLoadSurveysParams())

    await expect(promise).rejects.toThrow()
  })
})
