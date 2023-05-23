import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('invalid_mail')

    expect(isValid).toBe(false)
  })
})
