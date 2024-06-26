import { DbLoadAccountByToken } from './db-load-account-by-token'
import {
  type Decrypter,
  type LoadAccountByTokenRepository
} from './protocols'
import { mockAccountModel } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByToken } from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenStub = mockLoadAccountByToken()
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

    expect(account).toEqual(mockAccountModel())
  })

  it('should return undefined if Decrypter throws', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())

    const result = await sut.load({
      token: 'any_token'
    })

    expect(result).toBeUndefined()
  })

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockRejectedValueOnce(new Error())

    const promise = sut.load({
      token: 'any_token'
    })

    await expect(promise).rejects.toThrow(new Error())
  })
})
