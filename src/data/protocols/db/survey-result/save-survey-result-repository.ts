import { type SaveSurveyResultParams } from '@/domain/use-cases'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<void>
}
