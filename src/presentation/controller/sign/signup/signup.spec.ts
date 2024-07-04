import { SignUpController } from './signup'
import {
  type AddAccount,
  type Validation,
  badRequest,
  serverError,
  ServerError,
  success,
  type Authentication,
  forbidden,
  EmailInUseError,
  type Controller
} from './protocols'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'

const mockRequest = (override?: Partial<SignUpController.Request>): SignUpController.Request => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  ...override
})

type SutTypes = {
  sut: Controller<SignUpController.Request>
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const request = mockRequest()

    await sut.handle(request)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(serverError(new ServerError()))
  })

  it('should return 200 if valid data is provided', async () => {
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
    const response = await sut.handle(request)

    expect(response).toEqual(badRequest(new Error('any_error')))
  })

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

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(serverError(new ServerError()))
  })

  it('should return 403 if AddAccount returns false', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(false)

    const request = mockRequest()

    const response = await sut.handle(request)

    expect(response).toEqual(forbidden(new EmailInUseError()))
  })
})
