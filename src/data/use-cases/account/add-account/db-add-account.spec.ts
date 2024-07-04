import {
  type AddAccountRepository,
  type Hasher,
  type LoadAccountByEmailRepository
} from './protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(undefined)
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccountUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(mockAccountModel())

    const account = await sut.add(mockAddAccountParams())

    expect(account).toBeFalsy()
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut()
    const hashedSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(mockAddAccountParams())

    expect(hashedSpy).toHaveBeenCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    const { hasherStub, sut } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(mockAddAccountParams())

    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()

    const isAddedAccount = await sut.add(mockAddAccountParams())

    expect(isAddedAccount).toBeTruthy()
  })
})
