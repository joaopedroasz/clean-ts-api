import { type LogErrorRepository } from '../../data/protocols'
import { serverError, success } from '../../presentation/helpers/http'
import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return success({ any_field: 'any_value' })
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (override?: Partial<HttpRequest>): HttpRequest => ({
  body: {
    any_field: 'any_values',
    ...override?.body
  }
})

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controller, logErrorRepository)
  return {
    sut,
    controllerStub: controller,
    logErrorRepositoryStub: logErrorRepository
  }
}

describe('LogControllerDecorator', () => {
  it('should call Controller.handle with correct values', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(success({ any_field: 'any_value' }))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(fakeError))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    const httpRequest: HttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
