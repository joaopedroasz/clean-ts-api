import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  }
}))

describe('JWT Adapter', () => {
  it('should call jwt.sign with correct values', async () => {
    const sut = new JwtAdapter('any_secret')
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith(
      {
        value: 'any_value'
      },
      'any_secret'
    )
  })

  it('should return a token on jwt.sign success', async () => {
    const sut = new JwtAdapter('any_secret')

    const token = await sut.encrypt('any_value')

    expect(token).toBe('any_token')
  })

  it('should throw if jwt.sign throws', async () => {
    const sut = new JwtAdapter('any_secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('any_error')
    })

    const promise = sut.encrypt('any_value')

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })
})
