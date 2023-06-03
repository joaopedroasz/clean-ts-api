import { MissingParamError } from '../../errors'
import { type Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  public validate (input: Record<string, unknown>): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
