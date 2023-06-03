import { type Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  public validate (input: Record<string, unknown>): Error | undefined {
    for (const validation of this.validations) {
      validation.validate(input)
    }
  }
}
