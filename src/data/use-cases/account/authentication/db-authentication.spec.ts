import type {
  HashCompare,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository
} from './protocols'
import { DbAuthentication } from './db-authentication'
import { mockHashCompare, mockEncrypter, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAuthenticationParams } from '@/domain/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashCompareStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
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
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const email = 'called_email@mail.com'
    const authentication = mockAuthenticationParams({ email })

    await sut.auth(authentication)

    expect(loadAccountSpy).toHaveBeenCalledWith(email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeUndefined()
  })

  it('should call HashCompare with provided password and account password', async () => {
    const { sut, hashCompareStub } = makeSut()
    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare')

    const authentication = mockAuthenticationParams({ password: 'original_password' })
    await sut.auth(authentication)

    expect(hashCompareSpy).toHaveBeenCalledWith({
      plainText: 'original_password',
      hash: 'hashed_password'
    })
  })

  it('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should return undefined if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)

    const authentication = mockAuthenticationParams()
    const accessToken = await sut.auth(authentication)

    expect(accessToken).toBeUndefined()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const authentication = mockAuthenticationParams({})
    await sut.auth(authentication)

    expect(encrypterSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('should return an Authentication on success', async () => {
    const { sut } = makeSut()

    const authentication = mockAuthenticationParams()
    const authenticationResponse = await sut.auth(authentication)

    expect(authenticationResponse).toEqual({
      accessToken: 'any_token',
      name: 'any_name'
    })
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    const authentication = mockAuthenticationParams()
    await sut.auth(authentication)

    expect(updateAccessTokenSpy).toHaveBeenCalledWith({
      id: 'any_id',
      token: 'any_token'
    })
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
