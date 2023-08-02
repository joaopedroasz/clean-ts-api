import { type LoadSurveysRepository, type LoadSurveys, type SurveyModel } from './protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  public async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.load()
  }
}
