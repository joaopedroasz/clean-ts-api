import { type HttpRequest, type HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  it('should call Controller.handle with correct values', async () => {
    class ControllerStub {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return {
          statusCode: 200,
          body: {
            any_field: 'any_value'
          }
        }
      }
    }
    const controller = new ControllerStub()
    const sut = new LogControllerDecorator(controller)
    const handleSpy = jest.spyOn(controller, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        any_field: 'any_value'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
