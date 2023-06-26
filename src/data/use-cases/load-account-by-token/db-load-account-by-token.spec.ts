import { type Decrypter } from '../../protocols/criptography'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken UseCase', () => {
  it('should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return 'any_value'
      }
    }
    const decrypterStub = new DecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load({
      token: 'any_token'
    })

    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
})
