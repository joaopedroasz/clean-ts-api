import MockDate from 'mockdate'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { type SurveyResultModel, type SaveSurveyResultParams, type SaveSurveyResultRepository } from './protocols'

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
  surveyId: 'any_survey_id'
})

const makeFakeSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
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

    await sut.save(makeFakeSaveSurveyResultParams())

    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultParams())
  })

  it('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(makeFakeSaveSurveyResultParams())

    expect(surveyResult).toEqual(makeFakeSurveyResultModel())
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())

    const promise = sut.save(makeFakeSaveSurveyResultParams())

    await expect(promise).rejects.toThrowError(new Error())
  })
})
