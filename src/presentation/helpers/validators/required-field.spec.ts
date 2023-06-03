import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any')
}

describe('Required Fields Validation', () => {
  it('should return MissingParamError if an provided param does not exist in object', () => {
    const sut = makeSut()
    const input = {
      other: 'other'
    }

    const result = sut.validate(input)

    expect(result).toEqual(new MissingParamError('any'))
  })

  it('should return undefined if an provided param exists in object', () => {
    const sut = makeSut()
    const input = {
      any: 'any',
      other: 'other'
    }

    const result = sut.validate(input)

    expect(result).toBeUndefined()
  })
})
