import { InvalidParamError } from '../../presentation/errors'
import { type EmailValidator } from '../protocols/email-validator'
import { type Validation } from '../../presentation/protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly emailFieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  public validate (input: Record<string, unknown>): Error | undefined {
    const email = input[this.emailFieldName]
    const isValidEmail = this.emailValidator.isValid(email as string)
    if (!isValidEmail) return new InvalidParamError(this.emailFieldName)
  }
}
