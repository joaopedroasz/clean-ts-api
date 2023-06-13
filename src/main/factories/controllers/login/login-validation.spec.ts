import { EmailValidation, ValidationComposite, RequiredFieldValidation } from '../../../../presentation/helpers/validators'
import { type EmailValidator } from '../../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const result = makeLoginValidation()

    expect(result).toBeTruthy()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
