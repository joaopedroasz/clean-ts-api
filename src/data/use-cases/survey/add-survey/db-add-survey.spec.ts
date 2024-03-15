import MockDate from 'mockdate'

import { type AddSurveyRepository } from './protocols'
import { DbAddSurvey } from './db-add-survey'
import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(mockAddSurveyParams())

    expect(addSpy).toHaveBeenCalledWith(mockAddSurveyParams())
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddSurveyParams())

    await expect(promise).rejects.toThrow(new Error())
  })
})
