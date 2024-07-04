import { mockLoadAccountByToken } from '../test'
import { AuthMiddleware } from './auth-middleware'
import {
  type LoadAccountByToken,
  forbidden,
  success,
  serverError,
  AccessDeniedError
} from './protocols'

const mockRequest = (override?: Partial<AuthMiddleware.Request>): AuthMiddleware.Request => ({ accessToken: 'any_token', ...override })

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token existes in headers', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest({ accessToken: '' }))

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith({ token: 'any_token', role })
  })

  it('should return 403 if LoadAccountByToken returns undefined', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(undefined)

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(success({ accountId: 'any_id' }))
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
