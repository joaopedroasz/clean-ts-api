import { type Validation } from '@/presentation/protocols/validation'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: Record<string, unknown>): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}
