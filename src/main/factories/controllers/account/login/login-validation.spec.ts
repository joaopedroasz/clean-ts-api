import { EmailValidation, ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { makeLoginValidation } from './login-validation'
import { mockEmailValidator } from '@/validation/test'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const result = makeLoginValidation()

    expect(result).toBeTruthy()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', mockEmailValidator())
    ])
  })
})
