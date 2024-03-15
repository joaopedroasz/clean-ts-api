import { type SurveyModel } from '@/domain/models'
import type { LoadSurveyById, AddSurvey, AddSurveyParams, LoadSurveys } from '@/domain/use-cases'
import { mockSurveyModel } from '@/domain/test'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | undefined> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    public async load (): Promise<SurveyModel[]> {
      return [mockSurveyModel()]
    }
  }
  return new LoadSurveysStub()
}
