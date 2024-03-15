import { type Validation } from '../protocols/validation'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: Record<string, unknown>): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}
