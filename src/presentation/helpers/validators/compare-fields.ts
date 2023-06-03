import { InvalidParamError } from '../../errors'
import { type Validation } from './validation'

export interface CompareFieldsValidationParams {
  fieldName: string
  fieldToCompareName: string
}

export class CompareFieldsValidation implements Validation {
  private readonly fields: CompareFieldsValidationParams

  constructor (fields: CompareFieldsValidationParams) {
    this.fields = fields
  }

  public validate (input: Record<string, unknown>): Error | undefined {
    const { fieldName, fieldToCompareName } = this.fields
    const field = input[fieldName]
    const fieldToCompare = input[fieldToCompareName]

    if (field !== fieldToCompare) {
      return new InvalidParamError(fieldToCompareName)
    }
  }
}
