import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_value'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const SALT = 12

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(SALT)

  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  describe('hash', () => {
    it('should call bcrypt.hash with correct value', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
    })

    it('should return a valid hash on bcrypt.hash success', async () => {
      const { sut } = makeSut()

      const hash = await sut.hash('any_value')

      expect(hash).toBe('hashed_value')
    })

    it('should throw if bcrypt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.hash('any_value')

      await expect(promise).rejects.toThrowError(new Error())
    })
  })

  describe('compare', () => {
    it('should call bcrypt.compare with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare({
        plainText: 'any_value',
        hash: 'hashed_value'
      })

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
    })
  })
})
