import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },
  verify (): string {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('any_secret')
}

describe('JWT Adapter', () => {
  describe('encrypt', () => {
    it('should call jwt.sign with correct values', async () => {
      const sut = makeSut()
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
      const sut = makeSut()

      const token = await sut.encrypt('any_value')

      expect(token).toBe('any_token')
    })

    it('should throw if jwt.sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error('any_error')
      })

      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrowError(new Error('any_error'))
    })
  })

  describe('decrypt', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'any_secret')
    })

    it('should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_token')

      expect(value).toBe('any_value')
    })

    it('should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('any_error')
      })

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrowError(new Error('any_error'))
    })
  })
})
