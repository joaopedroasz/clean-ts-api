import { InvalidParamError } from '../../errors'
import { type EmailValidator } from '../../protocols/email-validator'
import { type Validation } from './validation'

export class EmailValidation implements Validation {
  private readonly emailFieldName: string
  private readonly emailValidator: EmailValidator

  constructor (emailFieldName: string, emailValidator: EmailValidator) {
    this.emailFieldName = emailFieldName
    this.emailValidator = emailValidator
  }

  public validate (input: Record<string, unknown>): Error | undefined {
    const email = input[this.emailFieldName]
    const isValidEmail = this.emailValidator.isValid(email as string)
    if (!isValidEmail) return new InvalidParamError(this.emailFieldName)
  }
}
