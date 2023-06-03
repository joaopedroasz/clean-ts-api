import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields'

describe('Compare Fields Validation', () => {
  it('should return undefined if provided fields are equal', () => {
    const sut = new CompareFieldsValidation({
      fieldName: 'field',
      fieldToCompareName: 'fieldToCompare'
    })

    const isValid = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(isValid).toBeUndefined()
  })

  it('should return an error if provided fields are different', () => {
    const sut = new CompareFieldsValidation({
      fieldName: 'field',
      fieldToCompareName: 'fieldToCompare'
    })

    const isValid = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })

    expect(isValid).toEqual(new InvalidParamError('fieldToCompare'))
  })
})
