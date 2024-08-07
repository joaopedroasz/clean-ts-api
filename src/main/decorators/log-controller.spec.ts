import { type LogErrorRepository } from '@/data/protocols'
import { serverError, success } from '@/presentation/helpers/http/http'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller'
import { mockLogErrorRepository } from '@/data/test'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return success({ any_field: 'any_value' })
    }
  }
  return new ControllerStub()
}

const mockRequest = (override?: Partial<any>): any => ({
  any_field: 'any_values',
  ...override
})

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const logErrorRepository = mockLogErrorRepository()
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
    const request = mockRequest()

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const request = mockRequest()

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(success({ any_field: 'any_value' }))
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(fakeError))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    const request = mockRequest()

    await sut.handle(request)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
