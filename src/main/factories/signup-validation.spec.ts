import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const result = makeSignUpValidation()

    expect(result).toBeTruthy()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation({
        fieldName: 'password',
        fieldToCompareName: 'passwordConfirmation'
      })
    ])
  })
})
