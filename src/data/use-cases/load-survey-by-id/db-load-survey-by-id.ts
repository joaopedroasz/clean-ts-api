import { type LoadSurveyById, type LoadSurveyByIdRepository, type SurveyModel } from './protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  public async loadById (id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
  }
}
