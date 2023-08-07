import { MissingParamError } from '@/presentation/errors'
import { type Validation } from '@/presentation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
  }

  public validate (input: Record<string, unknown>): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
