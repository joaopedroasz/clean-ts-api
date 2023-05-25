import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_value'
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
  it('should call bcrypt with correct value', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  it('should return a hash on success', async () => {
    const { sut } = makeSut()

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashed_value')
  })
})
