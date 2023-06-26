import { type AccountModel } from '../../../domain/models'
import { type LoadAccountByTokenModel, type LoadAccountByTokenRepository } from '../../protocols'
import { type Decrypter } from '../../protocols/criptography'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'hashed_password'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByToken = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenStub implements LoadAccountByTokenRepository {
    async loadByToken (data: LoadAccountByTokenModel): Promise<AccountModel | undefined> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenStub)

  return {
    sut,
    decrypterStub,
    loadAccountByTokenStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load({
      token: 'any_token'
    })

    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  it('should return undefined if Decrypter returns undefined', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(undefined)

    const account = await sut.load({
      token: 'any_token'
    })

    expect(account).toBeUndefined()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')

    await sut.load({
      token: 'any_token',
      role: 'any_role'
    })

    expect(loadAccountByTokenSpy).toHaveBeenCalledWith({
      token: 'any_token',
      role: 'any_role'
    })
  })

  it('should return undefined if LoadAccountByTokenRepository returns undefined', async () => {
    const { loadAccountByTokenStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(undefined)

    const account = await sut.load({
      token: 'any_token'
    })

    expect(account).toBeUndefined()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.load({
      token: 'any_token',
      role: 'any_role'
    })

    expect(account).toEqual(makeFakeAccount())
  })
})
