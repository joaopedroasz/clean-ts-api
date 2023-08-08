import { InvalidParamError } from '@/presentation/errors'
import { type EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email'
import { type Validation } from '@/presentation/protocols/validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: Validation
  emailValidatorStub: EmailValidator
}

const makeSut = (emailFieldName?: string): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailFieldName ?? 'email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  it('should call EmailValidator with given email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const email = 'email@mail.com'

    sut.validate({ email })

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut('wrongEmail')
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const wrongEmail = 'wrong_email@mail.com'

    const error = sut.validate({ wrongEmail })

    expect(error).toEqual(new InvalidParamError('wrongEmail'))
  })

  it('should return undefined if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const email = 'valid_email@mail.com'

    const error = sut.validate({ email })

    expect(error).toBeUndefined()
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const email = 'mail@mail.com'

    const error = (): Error | undefined => sut.validate({ email })

    expect(error).toThrowError(new Error())
  })
})
