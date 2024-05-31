import { type LoadSurveysRepository, type LoadSurveys, type SurveyModel, type LoadSurveysParams } from './protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  public async load (params: LoadSurveysParams): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.load(params.accountId)
  }
}
