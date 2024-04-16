import MockDate from 'mockdate'

import type { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository } from './protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test'

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepository: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepository = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepository
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.load('any_survey_id')

    await expect(promise).rejects.toThrow(new Error())
  })

  it('should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns undefined', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepository } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(undefined)
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepository, 'loadById')

    await sut.load('any_survey_id')

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('should result SurveyResultModel with count and percent 0 if LoadSurveyResultRepository returns undefined', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(undefined)

    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual({
      surveyId: 'any_id',
      question: 'any_question',
      date: new Date(),
      answers: [
        {
          answer: 'any_answer',
          count: 0,
          percent: 0
        },
        {
          answer: 'other_answer',
          count: 0,
          percent: 0
        }
      ]
    })
  })
})
