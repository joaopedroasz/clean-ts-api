import MockDate from 'mockdate'

import { SaveSurveyResultController } from './save-survey-result'
import {
  type LoadSurveyById,
  forbidden,
  InvalidParamError,
  serverError,
  type SaveSurveyResult,
  success
} from './protocols'
import { mockSurveyResultModel } from '@/domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test'

const mockRequest = (override?: Partial<SaveSurveyResultController.Request>): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id',
  ...override
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(mockRequest())

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return 403 if LoadSurveyById returns undefined', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(undefined)

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest({ answer: 'wrong_answer' })
    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSurveyResultSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(mockRequest())

    expect(saveSurveyResultSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  it('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(success(mockSurveyResultModel()))
  })

  it('should return 403 if no account id provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest({ accountId: undefined }))

    expect(response).toEqual(forbidden(new InvalidParamError('accountId')))
  })
})
