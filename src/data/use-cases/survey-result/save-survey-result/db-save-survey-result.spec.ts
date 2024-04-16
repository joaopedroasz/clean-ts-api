import MockDate from 'mockdate'

import { DbSaveSurveyResult } from './db-save-survey-result'
import type { SaveSurveyResultRepository, LoadSurveyResultRepository } from './protocols'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('SaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(mockSaveSurveyResultParams())

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.save(mockSaveSurveyResultParams())

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(mockSaveSurveyResultParams())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSaveSurveyResultParams())

    await expect(promise).rejects.toThrow(new Error())
  })

  it('should throw if LoadSurveyResultRepository returns undefined', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(undefined)

    const promise = sut.save(mockSaveSurveyResultParams())

    await expect(promise).rejects.toThrow(new Error('Survey Result not found'))
  })
})
