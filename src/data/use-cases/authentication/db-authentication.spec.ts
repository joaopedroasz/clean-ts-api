import { type AccountModel } from '../../../domain/models'
import { type TokenGenerator, type HashCompare, type HashCompareInput, type LoadAccountByEmailRepository } from '../../protocols'
import { type AuthenticationModel } from '../add-account/protocols'
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
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

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    const authentication = makeFakeAuthentication({})
    await sut.auth(authentication)

    expect(tokenGeneratorSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrowError(new Error('any_error'))
  })

  it('should return a token on success', async () => {
    const { sut } = makeSut()

    const authentication = makeFakeAuthentication()
    const accessToken = await sut.auth(authentication)

    expect(accessToken).toBe('any_token')
  })
})
