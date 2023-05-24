import { DbAddAccount } from './db-add-account'

describe('DbAddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return 'hashed_password'
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
