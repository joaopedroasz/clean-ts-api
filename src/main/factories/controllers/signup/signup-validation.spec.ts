import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { type EmailValidator } from '../../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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
      }),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
