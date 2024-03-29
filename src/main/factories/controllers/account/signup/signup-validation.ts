import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidation
} from '@/validation/validators'
import { type Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation({
    fieldName: 'password',
    fieldToCompareName: 'passwordConfirmation'
  }))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
