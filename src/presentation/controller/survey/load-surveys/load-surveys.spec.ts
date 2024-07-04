import MockDate from 'mockdate'

import { LoadSurveysController } from './load-surveys'
import { type LoadSurveys, success, serverError, noContent, type Controller } from './protocols'
import { mockSurveyModel } from '@/domain/test'
import { mockLoadSurveys } from '@/presentation/test'

const mockRequest = (override?: LoadSurveysController.Request): LoadSurveysController.Request => ({ accountId: 'any_id', ...override })

type SutTypes = {
  sut: Controller<LoadSurveysController.Request>
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith({ accountId: 'any_id' })
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(success([mockSurveyModel()]))
  })

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(noContent())
  })
})
