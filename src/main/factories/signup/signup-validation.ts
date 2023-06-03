import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields'
import { EmailValidation } from '../../../presentation/helpers/validators/email'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field'
import { type Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

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
