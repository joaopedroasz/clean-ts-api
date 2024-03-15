import { type SurveyResultModel } from '@/domain/models'
import { type SaveSurveyResultRepository } from '../protocols'
import { type SaveSurveyResultParams } from '@/domain/use-cases'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
