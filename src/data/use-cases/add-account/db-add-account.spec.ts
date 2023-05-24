import { type Encrypter } from '../../protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
