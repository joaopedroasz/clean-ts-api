import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_value'
  }
}))

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  it('should return a hash on success', async () => {
    const sut = new BcryptAdapter(12)

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashed_value')
  })
})
