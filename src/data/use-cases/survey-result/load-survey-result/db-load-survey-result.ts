import { type LoadSurveyResult } from '@/domain/use-cases'
import type { LoadSurveyByIdRepository, LoadSurveyResultParams, LoadSurveyResultRepository, SurveyResultModel } from './protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async load ({ surveyId, accountId }: LoadSurveyResultParams): Promise<SurveyResultModel> {
    const result = await this.loadSurveyRepository.loadBySurveyId({ accountId, surveyId })
    if (result) return result

    const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
    if (!survey) throw new Error()
    return {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map(answer => ({
        answer: answer.answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    }
  }
}
