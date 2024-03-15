import { type Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'
import { mockValidation } from '../test'

type SutTypes = {
  sut: ValidationComposite
  anyValidation: Validation
  otherValidation: Validation
}

const makeSut = (): SutTypes => {
  const anyValidation = mockValidation()
  const otherValidation = mockValidation()
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

  it('should return the first error if any validation fails', () => {
    const { sut, anyValidation } = makeSut()
    jest.spyOn(anyValidation, 'validate').mockReturnValueOnce(new Error('any_error'))
    const input = {
      any: 'any',
      other: 'other'
    }

    const result = sut.validate(input)

    expect(result).toEqual(new Error('any_error'))
  })
})
