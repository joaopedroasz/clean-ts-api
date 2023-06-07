import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccountModel,
  type Hasher
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

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccountUseCase', () => {
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
