import { type AddSurveyParams } from '@/domain/use-cases'
import type { LoadSurveyByIdRepository, AddSurveyRepository, LoadSurveysRepository } from '../protocols'
import { type SurveyModel } from '@/domain/models'
import { mockSurveyModel } from '@/domain/test'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    public async add (surveyData: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async load (): Promise<SurveyModel[]> {
      return [mockSurveyModel()]
    }
  }
  return new LoadSurveysRepositoryStub()
}
