import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    public validate (input: Record<string, unknown>): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  anyValidation: Validation
  otherValidation: Validation
}

const makeSut = (): SutTypes => {
  const anyValidation = makeValidation()
  const otherValidation = makeValidation()
  const sut = new ValidationComposite([anyValidation, otherValidation])
  return {
    sut,
    anyValidation,
    otherValidation
  }
}

describe('Validation Composite', () => {
  it('should call every validation with provided object', () => {
    const { sut, anyValidation, otherValidation } = makeSut()
    const validateSpy = jest.spyOn(anyValidation, 'validate')
    const otherValidateSpy = jest.spyOn(otherValidation, 'validate')
    const input = {
      any: 'any',
      other: 'other'
    }

    sut.validate(input)

    expect(validateSpy).toHaveBeenCalledWith(input)
    expect(otherValidateSpy).toHaveBeenCalledWith(input)
  })

  it('should return undefined if every validation succeeds', () => {
    const { sut } = makeSut()
    const input = {
      any: 'any',
      other: 'other'
    }

    const result = sut.validate(input)

    expect(result).toBeUndefined()
  })
})
