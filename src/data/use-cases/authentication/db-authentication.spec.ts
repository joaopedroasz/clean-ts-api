import { type AccountModel } from '../../../domain/models'
import { type LoadAccountByEmailRepository } from '../../protocols'
import { type AuthenticationModel } from '../add-account/protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAuthentication = (override?: Partial<AuthenticationModel>): AuthenticationModel => ({
  email: 'email@mail.com',
  password: 'any_password',
  ...override
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return {
        id: 'any_id',
        email: 'email@mail.com',
        name: 'any_name',
        password: 'any_password'
      }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const email = 'called_email@mail.com'
    const authentication = makeFakeAuthentication({ email })

    await sut.auth(authentication)

    expect(loadAccountSpy).toHaveBeenCalledWith(email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })
})
