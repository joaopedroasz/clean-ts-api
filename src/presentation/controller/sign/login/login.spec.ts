import { mockAuthentication, mockValidation } from '@/presentation/test'
import { LoginController } from './login'
import {
  type Authentication,
  badRequest,
  serverError,
  unauthorized,
  success,
  type Validation,
  type Controller
} from './protocols'

const mockRequest = (override?: Partial<LoginController.Request>): LoginController.Request => ({
  email: 'any_email@mail.com',
  password: 'any_password',
  ...override
})

type SutTypes = {
  sut: Controller<LoginController.Request>
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()

    await sut.handle(request)

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(undefined)
    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws an exception', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(success({
      accessToken: 'any_token',
      name: 'any_name'
    }))
  })

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const request = mockRequest()
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('any_error'))

    const request = mockRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
})
