import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccountModel,
  type Hasher,
  type LoadAccountByEmailRepository
} from './protocols'
import { DbAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | undefined> {
      return undefined
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'hashed_password'
})

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
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

    await sut.add(makeFakeAddAccountModel())

    expect(loadAccountSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('should return undefined if LoadAccountByEmailRepository returns an account', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount())

    const account = await sut.add(makeFakeAddAccountModel())

    expect(account).toBeUndefined()
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut()
    const hashedSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(makeFakeAddAccountModel())

    expect(hashedSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if Hasher throws', async () => {
    const { hasherStub, sut } = makeSut()

    jest
      .spyOn(hasherStub, 'hash')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAddAccountModel())

    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAddAccountModel())

    expect(account).toEqual(makeFakeAccount())
  })
})
