import {
  type AccountModel,
  type AuthenticationModel,
  type HashCompare,
  type HashCompareInput,
  type LoadAccountByEmailRepository,
  type Encrypter,
  type UpdateAccessTokenInput,
  type UpdateAccessTokenRepository
} from './protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (override?: Partial<AccountModel>): AccountModel => ({
  id: 'any_id',
  email: 'email@mail.com',
  name: 'any_name',
  password: 'hashed_password',
  ...override
})

const makeFakeAuthentication = (override?: Partial<AuthenticationModel>): AuthenticationModel => ({
  email: 'email@mail.com',
  password: 'any_password',
  ...override
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (input: HashCompareInput): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (input: UpdateAccessTokenInput): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashCompare()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
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

  it('should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(undefined)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeUndefined()
  })

  it('should call HashCompare with provided password and account password', async () => {
    const { sut, hashCompareStub } = makeSut()
    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare')

    const authentication = makeFakeAuthentication({ password: 'original_password' })
    await sut.auth(authentication)

    expect(hashCompareSpy).toHaveBeenCalledWith({
      plainText: 'original_password',
      hash: 'hashed_password'
    })
  })

  it('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should return undefined if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)

    const authentication = makeFakeAuthentication()
    const accessToken = await sut.auth(authentication)

    expect(accessToken).toBeUndefined()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const authentication = makeFakeAuthentication({})
    await sut.auth(authentication)

    expect(encrypterSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should return a token on success', async () => {
    const { sut } = makeSut()

    const authentication = makeFakeAuthentication()
    const accessToken = await sut.auth(authentication)

    expect(accessToken).toBe('any_token')
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    const authentication = makeFakeAuthentication()
    await sut.auth(authentication)

    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      id: 'any_id',
      token: 'any_token'
    })
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })
})
